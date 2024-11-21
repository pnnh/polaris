package account

import (
	"net/http"
	"time"

	"multiverse-authorization/handlers/auth/authorizationserver"
	helpers2 "multiverse-authorization/helpers"

	"multiverse-authorization/models"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"multiverse-authorization/neutron/config"
	"multiverse-authorization/neutron/server/helpers"
	//"github.com/pnnh/neutronrvices/email"
)

func MailSignupBeginHandler(gctx *gin.Context) {
	username := gctx.PostForm("username")
	nickname := gctx.PostForm("nickname")
	if username == "" {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("account为空"))
		return
	}
	validate := validator.New()
	if err := validate.Var(username, "required,email"); err != nil {
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "account格式错误"))
		return
	}
	accountModel, err := models.GetAccountByUsername(username)
	if err != nil {
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "account不存在"))
		return
	}
	if accountModel == nil {
		accountModel = &models.AccountModel{
			Pk:          helpers.NewPostId(),
			Username:    username,
			Password:    "",
			CreateTime:  time.Now(),
			UpdateTime:  time.Now(),
			Nickname:    nickname,
			Mail:        username,
			Credentials: "",
			Session:     "",
		}
		if err := models.PutAccount(accountModel); err != nil {
			gctx.JSON(http.StatusOK, models.CodeError.WithError(err))
			return
		}
	} else {
		gctx.JSON(http.StatusOK, models.CodeAccountExists.WithMessage("账号已存在"))
		return
	}

	mailSender := config.MustGetConfigurationString("MAIL_SENDER")
	if len(mailSender) < 3 {
		gctx.JSON(http.StatusOK, models.CodeAccountExists.WithMessage("邮箱发送者未配置"))
		return
	}

	session := &models.SessionModel{
		Pk:         helpers.MustUuid(),
		Content:    "",
		CreateTime: time.Now(),
		UpdateTime: time.Now(),
		Username:   accountModel.Pk,
		Type:       "signup",
		Code:       helpers.RandNumberRunes(6),
	}

	if err := models.PutSession(session); err != nil {
		gctx.JSON(http.StatusOK, models.CodeError.WithError(err))
		return
	}

	// TODO: 为防止被刷，暂不发送邮件
	// subject := "注册验证码"
	// body := "您的验证码是: " + session.Code
	// err = email.SendMail(mailSender, subject, body, username)
	// if err != nil {
	// 	gctx.JSON(http.StatusOK, models.CodeError.ToResult())
	// 	return
	// }

	sessionData := map[string]interface{}{
		"session": session.Pk,
	}

	result := models.CodeOk.WithData(sessionData)

	gctx.JSON(http.StatusOK, result)
}

func MailSignupFinishHandler(gctx *gin.Context) {
	session := gctx.PostForm("session")
	code := gctx.PostForm("code")
	if session == "" || code == "" {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("code或session为空"))
		return
	}
	sessionModel, err := models.GetSession(session)
	if err != nil {
		gctx.JSON(http.StatusOK, models.ErrorResult(err))
		return
	}
	if sessionModel == nil {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("sessionModel不存在"))
		return
	}
	if sessionModel.Code != code {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("验证码错误"))
		return
	}
	sessionData := map[string]interface{}{
		"session": sessionModel.Pk,
	}

	result := models.CodeOk.WithData(sessionData)

	gctx.JSON(http.StatusOK, result)
}

func MailSigninBeginHandler(gctx *gin.Context) {
	username := gctx.PostForm("username")
	if username == "" {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("account为空"))
		return
	}
	validate := validator.New()
	if err := validate.Var(username, "required,email"); err != nil {
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "account格式错误"))
		return
	}
	accountModel, err := models.GetAccountByUsername(username)
	if err != nil {
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "account不存在"))
		return
	}
	if accountModel == nil {
		gctx.JSON(http.StatusOK, models.CodeAccountNotExists.WithMessage("account不存在"))
		return
	}

	mailSender := config.MustGetConfigurationString("MAIL_SENDER")
	if len(mailSender) < 3 {
		gctx.JSON(http.StatusOK, models.CodeAccountExists.WithMessage("邮箱发送者未配置"))
		return
	}

	session := &models.SessionModel{
		Pk:         helpers.MustUuid(),
		Content:    "",
		CreateTime: time.Now(),
		UpdateTime: time.Now(),
		Username:   accountModel.Pk,
		Type:       "signin",
		Code:       helpers.RandNumberRunes(6),
	}

	if err := models.PutSession(session); err != nil {
		gctx.JSON(http.StatusOK, models.ErrorResult(err))
		return
	}

	// TODO: 为防止被刷，暂不发送邮件
	// subject := "登陆验证码"
	// body := "您的验证码是: " + session.Code
	// err = email.SendMail(mailSender, subject, body, username)
	// if err != nil {
	// 	gctx.JSON(http.StatusOK, models.CodeError.ToResult())
	// 	return
	// }

	sessionData := map[string]interface{}{
		"session": session.Pk,
	}

	result := models.CodeOk.WithData(sessionData)

	gctx.JSON(http.StatusOK, result)
}

func MailSigninFinishHandler(gctx *gin.Context) {
	session := gctx.PostForm("session")
	code := gctx.PostForm("code")
	if session == "" || code == "" {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("code或session为空"))
		return
	}
	sessionModel, err := models.GetSession(session)
	if err != nil {
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "获取session出错"))
		return
	}
	if sessionModel == nil {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("sessionModel不存在"))
		return
	}

	if sessionModel.Code != code {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("验证码错误"))
		return
	}

	user, err := models.GetAccount(sessionModel.Username)

	if err != nil || user == nil {
		helpers2.ResponseMessageError(gctx, "获取用户信息出错", err)
		return
	}

	jwtToken, err := helpers2.GenerateJwtTokenRs256(user.Username,
		authorizationserver.PrivateKeyString,
		sessionModel.JwtId)
	if (jwtToken == "") || (err != nil) {
		helpers2.ResponseMessageError(gctx, "参数有误316", err)
		return
	}

	sessionData := map[string]interface{}{
		"authorization": jwtToken,
	}

	result := models.CodeOk.WithData(sessionData)

	gctx.JSON(http.StatusOK, result)
}
