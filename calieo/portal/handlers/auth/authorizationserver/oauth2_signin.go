package authorizationserver

import (
	// "encoding/base64"
	"github.com/gin-gonic/gin"
	// "multiverse-authorization/helpers"
	// "multiverse-authorization/models"
	// "multiverse-authorization/neutron/config"
	// "github.com/sirupsen/logrus"
	// "net/http"
)

func OAuth2SigninEndpoint(gctx *gin.Context) {
	// username := gctx.PostForm("username")
	// password := gctx.PostForm("password")
	// if username == "" || password == "" {
	// 	gctx.JSON(http.StatusOK, models.CodeError.WithMessage("用户名或密码为空"))
	// 	return
	// }
	// authInfo := gctx.Query("authinfo")

	// jwtToken, err := helpers.GenerateJwtTokenRs256(username, PrivateKeyString)
	// if err != nil {
	// 	gctx.JSON(http.StatusOK, models.CodeError.WithMessage("生成token失败"))
	// 	return
	// }
	// gctx.SetCookie("Authorization", jwtToken, 3600, "/", "", false, true)

	// if authInfo == "" {

	// 	webUrl, _ := config.GetConfigurationString("WEB_URL")
	// 	if webUrl == "" {
	// 		logrus.Errorln("WEB_URL未配置")
	// 		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("WEB_URL未配置"))
	// 		return
	// 	}
	// 	gctx.Redirect(http.StatusFound, webUrl)
	// 	return

	// }
	// authBytes, err := base64.URLEncoding.DecodeString(authInfo)
	// if err != nil {
	// 	gctx.JSON(http.StatusOK, models.CodeError.WithMessage("authInfo解析失败"))
	// 	return
	// }
	// redirectUrl := string(authBytes)
	// if len(redirectUrl) < 1 {
	// 	gctx.JSON(http.StatusOK, models.CodeError.WithMessage("redirectUrl为空"))
	// 	return
	// }
	// gctx.Redirect(http.StatusFound, redirectUrl)
}
