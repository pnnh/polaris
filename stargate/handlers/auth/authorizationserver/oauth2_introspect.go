package authorizationserver

import (
	// "encoding/json"
	// "errors"
	// "log"

	"log"
	"net/http"
	"net/url"

	"multiverse-authorization/models"

	"github.com/gin-gonic/gin"
	// "github.com/ory/fosite/handler/openid"
	// "multiverse-authorization/server/models"
)

func IntrospectionEndpoint(gctx *gin.Context) {
	// ctx := gctx.Request.Context()
	// oauth2Session := newSession("xxx_introspection_user")
	// authToken := gctx.PostForm("token")
	// if authToken == "" {
	// 	log.Printf("Error occurred in NewIntrospectionRequest222")
	// 	oauth2.WriteIntrospectionError(ctx, gctx.Writer, errors.New("kkju"))
	// 	return
	// }
	// userSession, err := models.FindSessionByOAuth2(authToken)
	// if err != nil {
	// 	log.Printf("Error occurred in NewIntrospectionRequest333: %+v", err)
	// 	oauth2.WriteIntrospectionError(ctx, gctx.Writer, err)
	// 	return
	// }
	// oauth2Session := &openid.DefaultSession{}
	// if err = json.Unmarshal([]byte(userSession.Oauth2Session.String), oauth2Session); err != nil {
	// 	log.Printf("Error occurred in NewIntrospectionRequest444: %+v", err)
	// 	oauth2.WriteIntrospectionError(ctx, gctx.Writer, err)
	// 	return
	// }

	ctx := gctx.Request.Context()

	accessToken := gctx.PostForm("token")
	if accessToken == "" {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("access_token为空"))
		return
	}
	id, _, ok := gctx.Request.BasicAuth()
	if !ok {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("idToken为空2"))
		return
	}

	clientId, err := url.QueryUnescape(id)
	if err != nil {
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "idToken为空3"))
		return
	}

	session, err := models.FindSessionByAccessToken(clientId, accessToken)
	if err != nil || session == nil {
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "idToken为空4"))
		return
	}

	oauth2Session := newSession(session.Username)

	ir, err := oauth2.NewIntrospectionRequest(ctx, gctx.Request, oauth2Session)
	if err != nil {
		log.Printf("Error occurred in NewIntrospectionRequest: %+v", err)
		oauth2.WriteIntrospectionError(ctx, gctx.Writer, err)
		return
	}

	oauth2.WriteIntrospectionResponse(ctx, gctx.Writer, ir)
}
