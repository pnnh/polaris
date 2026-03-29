package models

import (
	"net/http"

	"github.com/gin-gonic/gin"
	nemodels "github.com/pnnh/neutron/models"
	"github.com/sirupsen/logrus"
)

func ResponseCode(gctx *gin.Context, code nemodels.NECode) {
	message := nemodels.NECodeMessage(nemodels.LangZh, code)
	ResponseCodeMessageData(gctx, code, message, nil)
}

func ResponseCodeMessageData(gctx *gin.Context, code nemodels.NECode, message string, data interface{}) {
	jsonBody := gin.H{"code": code}
	if len(message) > 0 {
		jsonBody["message"] = message
	}
	if data != nil {
		jsonBody["data"] = data
	}
	gctx.JSON(http.StatusOK, jsonBody)
}

func ResponseCodeMessageError(gctx *gin.Context, code nemodels.NECode, message string, err error) {
	if err != nil {
		logrus.Errorln("ResponseCodeMessageError", gctx.FullPath(), message, err)
	}
	ResponseCodeMessageData(gctx, code, message, nil)
}

func ResponseMessageError(gctx *gin.Context, message string, err error) {
	if err != nil {
		logrus.Errorln("ResponseMessageError", message, err)
	}
	ResponseCodeMessageData(gctx, nemodels.NECodeError, message, nil)
}
