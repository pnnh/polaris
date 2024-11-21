package handlers

import (
	"net/http"
	"strings"

	"multiverse-authorization/handlers/auth/authorizationserver"
	helpers2 "multiverse-authorization/helpers"

	"github.com/gin-gonic/gin"
)

type SessionHandler struct {
}

func (s *SessionHandler) Introspect(gctx *gin.Context) {
	authHeader := gctx.Request.Header.Get("Portal-Authorization")

	jwtToken := strings.TrimPrefix(authHeader, "Bearer ")

	username, err := helpers2.ParseJwtTokenRs256(jwtToken, authorizationserver.PublicKeyString)
	if err != nil {
		helpers2.ResponseCodeMessageError(gctx, 401, "token解析失败", err)
		return
	}

	resp := make(map[string]interface{})
	resp["code"] = 200
	resp["data"] = map[string]interface{}{
		"username": username,
	}
	gctx.JSON(http.StatusOK, resp)
}
