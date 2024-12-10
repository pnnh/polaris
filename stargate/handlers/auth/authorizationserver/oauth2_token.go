package authorizationserver

import (
	"net/http"

	"multiverse-authorization/helpers"
	"multiverse-authorization/models"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func TokenEndpoint(gctx *gin.Context) {
	rw := gctx.Writer
	req := gctx.Request

	ctx := req.Context()

	authCode := gctx.PostForm("code")
	clientId := gctx.PostForm("client_id")
	if authCode == "" || clientId == "" {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("BasicAuth 2"))
		return
	}

	session, err := models.FindSessionByCode(clientId, authCode)
	if session == nil || err != nil {
		gctx.JSON(http.StatusOK, models.CodeError.WithError(err))
		return
	}

	oauth2Session := newSession(session.Username)

	accessRequest, err := oauth2.NewAccessRequest(ctx, req, oauth2Session)

	if err != nil {
		logrus.Printf("Error occurred in NewAccessRequest: %+v", err)
		oauth2.WriteAccessError(ctx, rw, accessRequest, err)
		return
	}

	if accessRequest.GetGrantTypes().ExactOne("client_credentials") {
		for _, scope := range accessRequest.GetRequestedScopes() {
			accessRequest.GrantScope(scope)
		}
	}

	response, err := oauth2.NewAccessResponse(ctx, accessRequest)
	if err != nil {
		logrus.Printf("Error occurred in NewAccessResponse: %+v", err)
		oauth2.WriteAccessError(ctx, rw, accessRequest, err)
		return
	}

	idTokenExtra := response.GetExtra("id_token").(string)
	accessToken := response.GetAccessToken()

	parsedClaims, err := helpers.ParseJwtTokenRs256(idTokenExtra, PublicKeyString)
	if err != nil {
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "idToken为空"))
		return
	}

	err = models.UpdateSessionToken(session.Pk, accessToken, idTokenExtra, parsedClaims.ID)
	if err != nil {
		logrus.Printf("Error occurred in NewAccessResponse2222: %+v", err)
		oauth2.WriteAccessError(ctx, rw, accessRequest, err)
		return
	}

	oauth2.WriteAccessResponse(ctx, rw, accessRequest, response)
}
