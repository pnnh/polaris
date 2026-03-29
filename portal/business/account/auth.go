package account

import (
	"database/sql"
	nemodels "github.com/pnnh/neutron/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/pnnh/neutron/helpers"
	"github.com/sirupsen/logrus"
	"portal/business"
	"portal/business/cloudflare"
	"portal/models"
)

func AppQueryHandler(gctx *gin.Context) {
	sessionAccountModel, err := business.FindAccountFromCookie(gctx)
	if err != nil {
		logrus.Warnln("UserinfoHandler", err)
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询账号出错c"))
		return
	}
	if sessionAccountModel == nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("用户未登录"))
		return
	}
	appName := gctx.Query("app")
	if appName == "" {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("app cannot be empty"))
		return
	}
	var appInfo map[string]string
	if appName == "thunder" {
		appInfo = map[string]string{
			"name":        "thunder",
			"description": "多元宇宙授权平台",
			"version":     "1.0.0",
			"title":       "ThunderApp",
		}
	} else if appName == "square" {
		appInfo = map[string]string{
			"name":        "square",
			"description": "短链平台",
			"version":     "1.0.0",
			"title":       "SquareApp",
		}
	} else {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("应用不存在"))
		return
	}

	result := nemodels.NECodeOk.WithData(appInfo)

	gctx.JSON(http.StatusOK, result)
}

type PermitAppLoginRequest struct {
	cloudflare.TurnstileModel
	App  string `json:"app"`
	Link string `json:"link"`
}

func PermitAppLoginHandler(gctx *gin.Context) {
	sessionAccountModel, err := business.FindAccountFromCookie(gctx)
	if err != nil {
		logrus.Warnln("UserinfoHandlercc", err)
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询账号出错c"))
		return
	}
	request := &PermitAppLoginRequest{}
	if err := gctx.ShouldBindJSON(request); err != nil {
		gctx.JSON(http.StatusBadRequest, nemodels.NECodeError.WithError(err))
		return
	}
	if request.App == "" || request.Link == "" {
		gctx.JSON(http.StatusBadRequest, nemodels.NECodeError.WithMessage("parameter app or link is empty"))
		return
	}
	if sessionAccountModel == nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("账号不存在fc"))
		return
	}
	oldSession, err := models.GetSessionByLink(request.App, request.Link)
	if err != nil {
		logrus.Warnln("PermitAppLoginHandler GetSessionByLink", err)
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询会话出错"))
		return
	}
	if oldSession != nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("会话已存在，请勿重复授权"))
		return
	}

	sessionModel := &models.SessionModel{
		Uid:          helpers.MustUuid(),
		Content:      "",
		CreateTime:   time.Now(),
		UpdateTime:   time.Now(),
		Username:     sessionAccountModel.Username,
		Type:         "auth",
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
		Account:      sessionAccountModel.Uid,
		Client:       sql.NullString{String: request.App, Valid: true},
		Link:         sql.NullString{String: request.Link, Valid: true},
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

	sessionView := &models.SessionViewModel{
		Uid: sessionModel.Uid,
	}
	result := nemodels.NECodeOk.WithData(sessionView)

	gctx.JSON(http.StatusOK, result)
}
