package account

import (
	"database/sql"
	"fmt"
	"net/http"
	"net/url"
	"strings"
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

type SigninRequest struct {
	cloudflare.TurnstileModel
	Username    string `json:"username"`    // 账号
	Password    string `json:"password"`    // 密码
	Fingerprint string `json:"fingerprint"` // 指纹
	Link        string `json:"link"`
}

func SigninHandler(gctx *gin.Context) {
	request := &SigninRequest{}
	if err := gctx.ShouldBindJSON(request); err != nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithError(err))
		return
	}
	if request.Username == "" || request.Password == "" {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("账号或密码为空"))
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
			gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("Signin验证出错"))
			return
		}
	}

	accountModel, err := models.GetAccountByUsername(request.Username)
	if err != nil {
		logrus.Println("GetAccountByUsername", err)
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询账号出错a"))
		return
	}
	if accountModel == nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("账号不存在"))
		return
	}
	if !helpers.CheckPasswordHash(request.Password, accountModel.Password) {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("密码错误"))
		return
	}

	sessionModel := &models.SessionModel{
		Uid:          helpers.MustUuid(),
		Content:      "",
		CreateTime:   time.Now(),
		UpdateTime:   time.Now(),
		Username:     request.Username,
		Type:         "signin",
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
	if request.Link != "" {
		sessionModel.Link = sql.NullString{String: request.Link, Valid: true}
	} else {
		sessionModel.Link = sql.NullString{
			String: "",
			Valid:  false,
		}
	}
	err = models.PutSession(sessionModel)
	if err != nil {
		logrus.Println("PutSession", err)
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("更新会话错误"))
		return
	}

	jwtPrivateKey, ok := config.GetConfigurationString("JWT_PRIVATE_KEY")
	if !ok || jwtPrivateKey == "" {
		logrus.Errorln("JWT_PRIVATE_KEY 未配置")
	}
	issuer := config.MustGetConfigurationString("PUBLIC_PORTAL_URL")

	jwtToken, err := helpers.GenerateJwtTokenRs256(sessionModel.Username, jwtPrivateKey, sessionModel.Uid, issuer)
	if (jwtToken == "") || (err != nil) {
		logrus.Println("GenerateJwtTokenRs256", err)
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("生成jwtToken错误"))
		return
	}
	selfUrl, ok := config.GetConfigurationString("PUBLIC_PORTAL_URL")
	if !ok || selfUrl == "" {
		logrus.Errorln("PUBLIC_SELF_URL 未配置")
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("PUBLIC_SELF_URL Unknown"))
		return
	}
	parsedUrl, err := url.Parse(selfUrl)
	if err != nil {
		logrus.Errorln("PUBLIC_SELF_URL 解析错误", err)
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("PUBLIC_SELF_URL Parse Error"))
		return
	}
	selfHostname := parsedUrl.Hostname()
	hostArr := strings.Split(selfHostname, ".")
	if len(hostArr) < 2 {
		logrus.Errorln("PUBLIC_SELF_URL Hostname Error", selfHostname)
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("PUBLIC_SELF_URL Hostname Error"))
		return
	}
	cookieDomain := fmt.Sprintf(".%s.%s", hostArr[len(hostArr)-2], hostArr[len(hostArr)-1])

	// 登录成功后设置cookie
	gctx.SetCookie(business.AuthCookieName, jwtToken, 3600*72, "/", cookieDomain, true, true)

	result := nemodels.NECodeOk.WithData(map[string]any{
		"changes": 1,
		"uid":     sessionModel.Uid,
	})

	gctx.JSON(http.StatusOK, result)
}
