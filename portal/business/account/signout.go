package account

import (
	nemodels "github.com/pnnh/neutron/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"portal/business"
)

func SignoutHandler(gctx *gin.Context) {
	// 移除cookie
	gctx.SetCookie(business.AuthCookieName, "", -1, "/", "", true, true)

	result := nemodels.NECodeOk.WithData(map[string]interface{}{"message": "退出成功"})

	gctx.JSON(http.StatusOK, result)

}
