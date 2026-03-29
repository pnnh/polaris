package userauth

import (
	"net/http"

	nemodels "github.com/pnnh/neutron/models"
	"portal/business"
	"portal/models"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func UserinfoHandler(gctx *gin.Context) {
	token := gctx.Query("token")
	sessionAccountModel, err := business.FindAccountFromToken(token)
	if err != nil {
		logrus.Warnln("UserinfoHandler2", err)
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询账号出错b2"))
		return
	}
	if sessionAccountModel == nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("账号不存在2"))
		return
	}
	selfModel := &models.SelfAccountModel{
		AccountModel: *sessionAccountModel,
		Username:     sessionAccountModel.Username,
	}

	result := nemodels.NECodeOk.WithData(selfModel)

	gctx.JSON(http.StatusOK, result)
}
