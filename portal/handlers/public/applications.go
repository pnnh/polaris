package public

import (
	"multiverse-authorization/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func PublicApplicationSelectHandler(gctx *gin.Context) {
	accounts, err := models.SelectApplicationsByStatus(1)
	if err != nil {
		gctx.JSON(http.StatusOK, models.CodeError.WithError(err))
		return
	}
	sessionData := map[string]interface{}{
		"list": accounts,
	}

	result := models.CodeOk.WithData(sessionData)

	gctx.JSON(http.StatusOK, result)
}
