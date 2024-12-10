package account

import (
	"encoding/base64"
	"net/http"
	"time"

	"multiverse-authorization/handlers/auth/authorizationserver"
	helpers2 "multiverse-authorization/helpers"

	"github.com/sirupsen/logrus"

	"multiverse-authorization/models"

	"github.com/gin-gonic/gin"
	"multiverse-authorization/neutron/server/helpers"
)

//func PasswordSignupBeginHandler(gctx *gin.Context) {
// username := gctx.PostForm("username")
// nickname := gctx.PostForm("nickname")
// if username == "" {
// 	gctx.JSON(http.StatusOK, models.CodeError.WithMessage("account为空"))
// 	return
// }
// accountModel, err := models.GetAccountByUsername(username)
// if err != nil {
// 	gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "account不存在"))
// 	return
// }
// if accountModel == nil {
// 	accountModel = &models.AccountModel{
// 		Pk:          helpers.NewPostId(),
// 		Username:    username,
// 		Password:    "",
// 		CreateTime:  time.Now(),
// 		UpdateTime:  time.Now(),
// 		Nickname:    nickname,
// 		Mail:        username,
// 		Credentials: "",
// 		Session:     "",
// 	}
// 	if err := models.PutAccount(accountModel); err != nil {
// 		gctx.JSON(http.StatusOK, models.CodeError.WithError(err))
// 		return
// 	}
// } else {
// 	gctx.JSON(http.StatusOK, models.CodeAccountExists.WithMessage("账号已存在"))
// 	return
// }

// session := &models.SessionModel{
// 	Pk:         helpers.MustUuid(),
// 	Content:    "",
// 	CreateTime: time.Now(),
// 	UpdateTime: time.Now(),
// 	Username:   accountModel.Pk,
// 	Type:       "signup_password",
// 	Code:       helpers.RandNumberRunes(6),
// }

// if err := models.PutSession(session); err != nil {
// 	gctx.JSON(http.StatusOK, models.CodeError.WithError(err))
// 	return
// }

// sessionData := map[string]interface{}{
// 	"session": session.Pk,
// }

// result := models.CodeOk.WithData(sessionData)

// gctx.JSON(http.StatusOK, result)
//}

func PasswordSignupFinishHandler(gctx *gin.Context) {
	username := gctx.PostForm("username")
	password := gctx.PostForm("password")
	source, _ := gctx.GetQuery("source")
	if username == "" || password == "" || source == "" {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("code或session为空"))
		return
	}
	// sessionModel, err := models.GetSession(session)
	// if err != nil {
	// 	gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "GetSession error"))
	// 	return
	// }
	// if sessionModel == nil {
	// 	gctx.JSON(http.StatusOK, models.CodeError.WithMessage("sessionModel不存在"))
	// 	return
	// }
	// if sessionModel.Type != "signup_password" {
	// 	gctx.JSON(http.StatusOK, models.CodeError.WithMessage("sessionModel类型不对"))
	// 	return
	// }
	accountModel, err := models.GetAccountByUsername(username)
	if err != nil {
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "GetAccount error"))
		return
	}
	if accountModel != nil {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("账号已存在"))
		return
	}

	encrypted, err := helpers.HashPassword(password)
	if err != nil {
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "HashPassword error"))
		return
	}

	accountModel = &models.AccountModel{
		Pk:          helpers.NewPostId(),
		Username:    username,
		Password:    encrypted,
		CreateTime:  time.Now(),
		UpdateTime:  time.Now(),
		Nickname:    username,
		Mail:        username,
		Credentials: "",
		Session:     "",
	}
	if err := models.PutAccount(accountModel); err != nil {
		gctx.JSON(http.StatusOK, models.ErrorResult(err))
		return
	}

	// if err := models.UpdateAccountPassword(username, encrypted); err != nil {
	// 	gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "UpdateAccountPassword error"))
	// 	return
	// }

	sourceData, err := base64.URLEncoding.DecodeString(source)
	if err != nil {
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "source解析失败"))
		return
	}
	sourceUrl := string(sourceData)
	if len(sourceUrl) < 1 {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("sourceUrl为空"))
		return
	}
	gctx.Redirect(http.StatusFound, sourceUrl)
}

func PasswordSigninFinishHandler(gctx *gin.Context) {
	source, _ := gctx.GetQuery("source")
	//session := gctx.PostForm("session")
	username := gctx.PostForm("username")
	password := gctx.PostForm("password")
	if username == "" || password == "" || source == "" {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("code或session为空2"))
		return
	}

	captchaKey := gctx.PostForm("captcha_key")
	if captchaKey == "" {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("captcha_key为空"))
		return
	}

	captchaModel, err := models.FindCaptcha(captchaKey)
	if captchaModel == nil || err != nil || captchaModel.Checked != 1 ||
		time.Now().Sub(captchaModel.CreateTime).Minutes() > 5 {
		logrus.Errorln("验证码错误", captchaKey, err)
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "验证码错误"))
		return
	}

	account, err := models.GetAccountByUsername(username)
	if err != nil {
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "GetAccount error"))
		return
	}
	if account == nil {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("account不存在"))
		return
	}

	ok := helpers.CheckPasswordHash(password, account.Password)

	if !ok {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("密码错误"))
		return
	}

	jwkModel, err := helpers2.GetJwkModel()
	if err != nil || jwkModel == nil {
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "GetJwkModel error"))
		return
	}

	session := &models.SessionModel{
		Pk:           helpers.NewPostId(),
		Content:      "",
		CreateTime:   time.Now(),
		UpdateTime:   time.Now(),
		Username:     username,
		Type:         "password",
		Code:         "",
		ClientId:     "",
		ResponseType: "",
		RedirectUri:  "",
		Scope:        "",
		State:        "",
		Nonce:        "",
		IdToken:      "",
		AccessToken:  "",
		JwtId:        jwkModel.Kid,
	}
	err = models.PutSession(session)
	if err != nil {
		logrus.Printf("Error occurred in NewAccessResponse2222: %+v", err)
		return
	}

	jwtToken, err := helpers2.GenerateJwtTokenRs256(account.Username,
		authorizationserver.PrivateKeyString,
		session.JwtId)
	if (jwtToken == "") || (err != nil) {
		helpers2.ResponseMessageError(gctx, "参数有误316", err)
		return
	}

	// 登录成功后设置cookie
	gctx.SetCookie("Portal-Authorization", jwtToken, 3600*48, "/", "", true, true)

	// sessionData := map[string]interface{}{
	// 	"authorization": jwtToken,
	// }

	sourceData, err := base64.URLEncoding.DecodeString(source)
	if err != nil {
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "source解析失败"))
		return
	}
	sourceUrl := string(sourceData)
	if len(sourceUrl) < 1 {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("sourceUrl为空"))
		return
	}
	gctx.Redirect(http.StatusFound, sourceUrl)

	// result := models.CodeOk.WithData(sessionData)

	// gctx.JSON(http.StatusOK, result)
}
