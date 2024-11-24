package authorizationserver

import (
	"github.com/gin-gonic/gin"
)

func RevokeEndpoint(gctx *gin.Context) {
	// This context will be passed to all methods.
	ctx := gctx.Request.Context()

	// This will accept the token revocation request and validate various parameters.
	err := oauth2.NewRevocationRequest(ctx, gctx.Request)

	// All done, send the response.
	oauth2.WriteRevocationResponse(ctx, gctx.Writer, err)
}
