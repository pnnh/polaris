package authorizationserver

import (
	// "encoding/json"
	// "errors"
	// "log"

	"fmt"
	"multiverse-authorization/helpers"

	"github.com/gin-gonic/gin"
	// "github.com/ory/fosite/handler/openid"
	// "multiverse-authorization/server/models"
)

func JwksEndpoint(gctx *gin.Context) {
	jwkString, err := helpers.GetJwk()
	if err != nil {
		gctx.AbortWithError(500, err)
		return
	}
	gctx.Header("Content-Type", "application/json; charset=utf-8")
	resp := fmt.Sprintf(`{"keys":[%s]}`, jwkString)

	gctx.String(200, resp)
}
