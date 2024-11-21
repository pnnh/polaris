package console

import (
	"multiverse-authorization/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func AdminGetAccount(ctx *gin.Context) {
	pk := ctx.Query("pk")
	username := ctx.Query("username")
	if pk == "" && username == "" {
		ctx.JSON(http.StatusOK, models.CodeInvalidParams)
		return
	}
	var model *models.AccountModel
	var err error
	if pk != "" {
		model, err = models.AccountDataSet.Get(pk)
	} else {
		model, err = models.AccountDataSet.GetWhere(func(m models.AccountSchema) {
			m.Username.Eq(username)
		})
	}
	if err != nil {
		ctx.JSON(http.StatusOK, models.CodeError.WithError(err))
		return
	}

	result := models.CodeOk.WithData(model)

	ctx.JSON(http.StatusOK, result)
}

func AdminSelectAccounts(ctx *gin.Context) {
	offset := ctx.PostForm("offset")
	limit := ctx.PostForm("limit")
	logrus.Debugln("offset", offset, "limit", limit)

	accounts, err := models.SelectAccounts(0, 10)
	if err != nil {
		ctx.JSON(http.StatusOK, models.CodeError.WithError(err))
		return
	}
	count, err := models.CountAccounts()
	if err != nil {
		ctx.JSON(http.StatusOK, models.CodeError.WithError(err))
		return
	}
	sessionData := map[string]interface{}{
		"list":  accounts,
		"count": count,
	}

	// result := models.CodeOk.WithData(sessionData)

	ctx.JSON(http.StatusOK, sessionData)
}
