package handlers

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	nemodels "github.com/pnnh/neutron/models"

	"portal/models"

	"github.com/pnnh/neutron/config"
	"github.com/pnnh/neutron/helpers"

	"github.com/gin-gonic/gin"
	"github.com/go-webauthn/webauthn/protocol"
	"github.com/go-webauthn/webauthn/webauthn"
	"github.com/sirupsen/logrus"
)

var webAuthn *webauthn.WebAuthn

func InitWebauthn() {

	RPID, _ := config.GetConfigurationString("RPID")
	RPOrigins, _ := config.GetConfigurationString("RPOrigins")
	if RPID == "" || RPOrigins == "" {
		logrus.Fatalln("RPOrigins key error22!")
	}

	webauthnConfig := &webauthn.Config{
		RPDisplayName: "Huable",
		RPID:          RPID,
		RPOrigins:     strings.Split(RPOrigins, ","),
	}
	if config.Debug() {
		webauthnConfig.Debug = true
	}
	var err error
	webAuthn, err = webauthn.New(webauthnConfig)
	if err != nil {
		logrus.Fatalln("webauthn初始化出错: %w", err)
	}

}

type WebauthnHandler struct {
}

func (s *WebauthnHandler) BeginRegistration(gctx *gin.Context) {

	username := gctx.Param("username")
	if len(username) < 1 {
		models.ResponseCode(gctx, nemodels.NECodeInvalidParameter)
		return
	}

	model, err := models.GetAccountByUsername(username)
	if err != nil {
		models.ResponseCodeMessageError(gctx, nemodels.NECodeError, "GetAccount error", err)
		return
	}
	if model != nil {
		models.ResponseCodeMessageError(gctx, nemodels.NECodeError, "账号已存在", err)
		return
	}
	displayName := strings.Split(username, "@")[0]
	webauthnModel := models.NewWebauthnAccount(username, displayName)

	registerOptions := func(credCreationOpts *protocol.PublicKeyCredentialCreationOptions) {
		credCreationOpts.CredentialExcludeList = webauthnModel.CredentialExcludeList()
	}

	options, sessionData, err := webAuthn.BeginRegistration(
		webauthnModel,
		registerOptions,
	)
	if err != nil {
		models.ResponseMessageError(gctx, "参数有误2", err)
		return
	}
	sessionBytes, err := json.Marshal(sessionData)
	if err != nil {
		models.ResponseMessageError(gctx, "序列化sessionData出错: ", err)
		return
	}
	logrus.Infoln("sessionBytes: ", string(sessionBytes))
	sessionText := base64.StdEncoding.EncodeToString(sessionBytes)
	// accountModel := &models.AccountModel{
	// 	Uid:          helpers.NewPostId(),
	// 	Username:    username,
	// 	Password:    "",
	// 	CreateTime:  time.Now(),
	// 	UpdateTime:  time.Now(),
	// 	Nickname:    displayName,
	// 	EMail:        username,
	// 	Credentials: "",
	// 	Session:     sessionText,
	// }
	webauthnModel.Session = sessionText
	logrus.Infoln("sessionData: ", sessionData)
	if err = models.PutAccount(&webauthnModel.AccountModel); err != nil {
		models.ResponseMessageError(gctx, "PutAccount error", err)
		return
	}

	resp := make(map[string]interface{})
	resp["code"] = 200
	resp["data"] = map[string]interface{}{
		"session": username,
		"options": options.Response,
	}

	jsonResponse(gctx.Writer, resp, http.StatusOK)
}

func (s *WebauthnHandler) FinishRegistration(gctx *gin.Context) {
	logrus.Infoln("FinishRegistration333")
	username := gctx.Param("username")
	if len(username) < 1 {
		models.ResponseMessageError(gctx, "参数有误a", nil)
		return
	}

	user, err := models.GetAccountByUsername(username)

	if err != nil {
		models.ResponseMessageError(gctx, "参数有误5", err)
		return
	}
	if user == nil {
		models.ResponseMessageError(gctx, fmt.Sprintf("GetAccount结果为空: %s", username), nil)
		return
	}
	sessionText := user.Session
	sessionBytes, err := base64.StdEncoding.DecodeString(sessionText)
	if err != nil {
		models.ResponseMessageError(gctx, fmt.Sprintf("反序列化session出错: %s", username), nil)
		return
	}
	logrus.Infoln("sessionBytes2: ", string(sessionBytes))
	sessionData := webauthn.SessionData{}
	err = json.Unmarshal(sessionBytes, &sessionData)
	if err != nil {
		models.ResponseMessageError(gctx, "序列化sessionData出错2: ", err)
		return
	}
	logrus.Infoln("sessionData2: ", sessionData)

	webauthnModel := models.CopyWebauthnAccount(user)
	credential, err := webAuthn.FinishRegistration(webauthnModel, sessionData, gctx.Request)
	if err != nil {
		models.ResponseMessageError(gctx, "参数有误37", err)
		return
	}

	webauthnModel.AddCredential(*credential)

	err = models.UpdateAccountCredentials(webauthnModel)
	if err != nil {
		models.ResponseMessageError(gctx, "UpdateAccountCredentials: %w", err)
		return
	}

	resp := make(map[string]interface{})
	resp["code"] = 200
	resp["data"] = "Registration Success"
	jsonResponse(gctx.Writer, resp, http.StatusOK)
}

func (s *WebauthnHandler) BeginLogin(gctx *gin.Context) {

	username := gctx.Param("username")
	if len(username) < 1 {
		models.ResponseMessageError(gctx, "参数有误b", nil)
		return
	}

	user, err := models.GetAccountByUsername(username)

	if err != nil {
		models.ResponseMessageError(gctx, "参数有误316", err)
		return
	}

	if user == nil {
		models.ResponseCode(gctx, nemodels.NECodeAccountNotExists)
		return
	}

	webauthnModel := models.CopyWebauthnAccount(user)
	options, sessionData, err := webAuthn.BeginLogin(webauthnModel)
	if err != nil {
		models.ResponseMessageError(gctx, "参数有误39", err)
		return
	}

	err = models.UpdateAccountSession(user, sessionData)
	if err != nil {
		models.ResponseMessageError(gctx, "UpdateAccountSession: %w", err)
		return
	}
	resp := make(map[string]interface{})
	resp["code"] = 200
	resp["data"] = map[string]interface{}{
		"session": username,
		"options": options.Response,
	}

	jsonResponse(gctx.Writer, resp, http.StatusOK)
}

func (s *WebauthnHandler) FinishLogin(gctx *gin.Context) {

	username := gctx.Param("username")
	if len(username) < 1 {
		models.ResponseMessageError(gctx, "参数有误", nil)
		return
	}
	verifyData := gctx.PostForm("verifyData")
	if len(verifyData) < 1 {
		models.ResponseMessageError(gctx, "verifyData参数有误", nil)
		return
	}
	source, ok := gctx.GetQuery("source")
	if source == "" || !ok {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("code或session为空a"))
		return
	}

	user, err := models.GetAccountByUsername(username)

	if err != nil {
		models.ResponseMessageError(gctx, "参数有误312", err)
		return
	}
	sessionData, err := models.UnmarshalWebauthnSession(user.Session)
	if err != nil {
		models.ResponseMessageError(gctx, "参数有误316", err)
		return
	}
	webauthnModel := models.CopyWebauthnAccount(user)
	// _, err = webAuthn.FinishLogin(webauthnModel, *sessionData, gctx.Request)
	// if err != nil {
	// 	models.ResponseMessageError(gctx, "参数有误315", err)
	// 	return
	// }
	logrus.Println("verifyData: \n", verifyData)
	assertionData, err := protocol.ParseCredentialRequestResponseBody(strings.NewReader(verifyData))
	if err != nil {
		models.ResponseMessageError(gctx, "参数有误317", err)
		return
	}
	credential, err := webAuthn.ValidateLogin(webauthnModel, *sessionData, assertionData)

	if err != nil {
		models.ResponseMessageError(gctx, "参数有误318", err)
		return
	}
	logrus.Debugln("credential: ", credential)

	jwkString, ok := config.GetConfigurationString("OAUTH2_JWK")
	if !ok {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("OAUTH2_JWK is not set"))
		return
	}
	jwkModel, err := helpers.GetJwkModel(jwkString)
	if err != nil || jwkModel == nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "GetJwkModel error"))
		return
	}
	session := &models.SessionModel{
		Uid:          helpers.NewPostId(),
		Content:      "",
		CreateTime:   time.Now(),
		UpdateTime:   time.Now(),
		Username:     username,
		Type:         "webauthn",
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
	issuer := config.MustGetConfigurationString("PUBLIC_PORTAL_URL")
	jwtToken, err := helpers.GenerateJwtTokenRs256(username,
		"authorizationserver.PrivateKeyString",
		session.JwtId, issuer)
	if (jwtToken == "") || (err != nil) {
		models.ResponseMessageError(gctx, "参数有误319", err)
		return
	}

	sourceData, err := base64.URLEncoding.DecodeString(source)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "source解析失败"))
		return
	}
	sourceUrl := string(sourceData)
	logrus.Debugln("sourceUrl: ", sourceUrl)

	// 登录成功后设置cookie
	gctx.SetCookie("Portal-Authorization", jwtToken, 3600*48, "/", "", true, true)

	resp := make(map[string]interface{})
	resp["code"] = 200
	resp["data"] = map[string]interface{}{"authorization": jwtToken, "source": sourceUrl}
	//jsonResponse(gctx.Writer, resp, http.StatusOK)

	// dj, err := json.Marshal(resp)
	// if err != nil {
	// 	gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("source解析失败222"))
	// 	return
	// }
	// gctx.JSON(http.StatusOK, resp)

	gctx.Redirect(http.StatusFound, sourceUrl)

}

func jsonResponse(w http.ResponseWriter, d interface{}, c int) {
	dj, err := json.Marshal(d)
	if err != nil {
		http.Error(w, "Error creating JSON response", http.StatusInternalServerError)
	}
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Test", "Custom")
	w.WriteHeader(c)
	_, err = fmt.Fprintf(w, "%s", dj)
	if err != nil {
		http.Error(w, "Error creating JSON response", http.StatusInternalServerError)
	}
}
