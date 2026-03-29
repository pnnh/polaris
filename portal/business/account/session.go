package account

import (
	nemodels "github.com/pnnh/neutron/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"portal/models"
)

func SessionQueryHandler(gctx *gin.Context) {
	link := gctx.Query("link")
	session := gctx.Query("session")
	app := gctx.Query("app")

	var sessionAccountModel *models.SessionModel
	var err error
	if session != "" {
		sessionAccountModel, err = models.GetSessionById(session)
		if err != nil {
			logrus.Warnln("UserinfoHandler2", err)
			gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询账号出错b"))
			return
		}
	} else if link != "" && app != "" {
		sessionAccountModel, err = models.GetSessionByLink(app, link)
		if err != nil {
			logrus.Warnln("UserinfoHandler3", err)
			gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询账号出错e"))
			return
		}
	} else {
		gctx.JSON(http.StatusBadRequest, nemodels.NECodeError.WithMessage("parameters invalid"))
		return
	}
	if sessionAccountModel == nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("账号不存在"))
		return
	}
	databaseAccountModel, err := models.GetAccount(sessionAccountModel.Account)
	if err != nil || databaseAccountModel == nil {
		logrus.Warnln("UserinfoHandler", err)
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询账号信息出错"))
		return
	}
	selfAccountModel := &models.SelfAccountModel{
		AccountModel: *databaseAccountModel,
		Username:     sessionAccountModel.Username,
	}

	result := nemodels.NECodeOk.WithData(selfAccountModel)

	gctx.JSON(http.StatusOK, result)
}
