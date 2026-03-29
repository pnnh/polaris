package account

import (
	"net/http"
	"time"

	nemodels "github.com/pnnh/neutron/models"

	"portal/business"
	"portal/business/cloudflare"
	"portal/models"

	"github.com/gin-gonic/gin"
	"github.com/pnnh/neutron/config"
	"github.com/pnnh/neutron/helpers"
	"github.com/sirupsen/logrus"
)

type SignupRequest struct {
	cloudflare.TurnstileModel
	Username       string `json:"username"`         // 账号
	Password       string `json:"password"`         // 密码
	ConfimPassword string `json:"confirm_password"` // 确认密码
	Nickname       string `json:"nickname"`         // 昵称
	EMail          string `json:"email"`            // 邮箱
	Fingerprint    string `json:"fingerprint"`      // 指纹
}

func SignupHandler(gctx *gin.Context) {
	request := &SignupRequest{}
	if err := gctx.ShouldBindJSON(request); err != nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithError(err))
		return
	}
	if request.Username == "" || request.Password == "" {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("账号或密码为空"))
		return
	}
	if request.Password != request.ConfimPassword {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("两次密码不一致"))
		return
	}

	serveMode, ok := config.GetConfigurationString("SERVE_MODE")
	if !ok || serveMode == "" {
		logrus.Errorln("serveMode未配置2")
	}
	if serveMode == "SELFHOST" {
		// 本地主机模式不需要真人校验，直接跳过
	} else if serveMode == "LOCALNET" {
		// todo: 处理局域网环境下的登录验证
	} else {
		// 默认为云端广域网环境服务模式，需要进行Turnstile验证
		ipAddr := helpers.GetIpAddress(gctx)
		verifyOk, err := cloudflare.VerifyTurnstileToken(request.TurnstileModel.TurnstileToken, ipAddr)
		if err != nil || !verifyOk {
			logrus.Println("VerifyTurnstileToken", err)
			gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("Signup验证出错"))
			return
		}
	}

	isExist, err := models.CheckAccountExists(request.Username)
	if err != nil {
		logrus.Println("CheckAccountExists", err)
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("查询账户出错"))
		return
	}
	if isExist {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("账户已存在"))
		return
	}

	hashPassword, err := helpers.HashPassword(request.Password)
	if err != nil {
		logrus.Println("HashPassword", err)
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("密码加密出错"))
		return
	}
	accountModel := &models.AccountModel{
		Uid:         helpers.MustUuid(),
		Username:    request.Username,
		Password:    hashPassword,
		Photo:       "",
		CreateTime:  time.Now().UTC(),
		UpdateTime:  time.Now().UTC(),
		Nickname:    request.Nickname,
		EMail:       request.EMail,
		Credentials: "",
		Session:     "",
		Description: "",
		Status:      0,
		Website:     "",
		Fingerprint: request.Fingerprint,
	}
	err = models.EnsureAccount(accountModel)
	if err != nil || accountModel == nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "更新用户账户出错"))
		return
	}

	sessionModel := &models.SessionModel{
		Uid:          helpers.MustUuid(),
		Content:      "",
		CreateTime:   time.Now(),
		UpdateTime:   time.Now(),
		Username:     request.Username,
		Type:         "signup",
		Code:         "",
		ClientId:     "",
		ResponseType: "",
		RedirectUri:  "",
		Scope:        "",
		State:        "",
		Nonce:        "",
		IdToken:      "",
		AccessToken:  "",
		JwtId:        "",
		Account:      accountModel.Uid,
	}
	err = models.PutSession(sessionModel)
	if err != nil {
		logrus.Println("PutSession", err)
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("更新会话错误"))
		return
	}

	jwtPrivateKey, ok := config.GetConfigurationString("JWT_PRIVATE_KEY")
	if !ok || jwtPrivateKey == "" {
		logrus.Errorln("JWT_PRIVATE_KEY 未配置2")
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("服务器未配置JWT_PRIVATE_KEY"))
		return
	}

	issuer := config.MustGetConfigurationString("PUBLIC_PORTAL_URL")
	jwtToken, err := helpers.GenerateJwtTokenRs256(sessionModel.Username, jwtPrivateKey, sessionModel.Uid, issuer)
	if (jwtToken == "") || (err != nil) {
		logrus.Println("GenerateJwtTokenRs256", err)
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("生成jwtToken错误"))
		return
	}

	// 登录成功后设置cookie
	gctx.SetCookie(business.AuthCookieName, jwtToken, 3600*72, "/", "", true, true)

	result := nemodels.NECodeOk.WithData(map[string]any{
		"changes": 1,
		"uid":     accountModel.Uid,
	})

	gctx.JSON(http.StatusOK, result)
}
