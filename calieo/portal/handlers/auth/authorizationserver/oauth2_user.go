package authorizationserver

import (
	// "encoding/json"
	// "errors"
	// "log"

	"context"
	"net/http"
	"net/url"

	"multiverse-authorization/helpers"
	"multiverse-authorization/models"

	"github.com/gin-gonic/gin"
	"github.com/ory/fosite"
	"github.com/sirupsen/logrus"
)

// UserEndpoint 非OAuth2标准，自有实现。通过id_token或者access_token获取用户信息。
func UserEndpoint(gctx *gin.Context) {
	ctx := gctx.Request.Context()

	auth := gctx.Request.Header.Get("Portal-Authorization")
	logrus.Infoln("auth: ", auth)

	id, secret, ok := gctx.Request.BasicAuth()
	if !ok {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("idToken为空2"))
		return
	}

	clientID, err := url.QueryUnescape(id)
	if err != nil {
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "idToken为空3"))
		return
	}

	clientSecret, err := url.QueryUnescape(secret)
	if err != nil {
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "idToken为空4"))
		return
	}

	client, err := fositeStore.GetClient(ctx, clientID)
	if err != nil {
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "idToken为空5"))
		return
	}

	if err := checkClientSecret(ctx, client, []byte(clientSecret)); err != nil {
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "idToken为空6"))
		return
	}

	idToken := gctx.PostForm("id_token")
	if idToken == "" {
		gctx.JSON(http.StatusOK, models.CodeError.WithMessage("idToken为空"))
		return
	}
	parsedClaims, err := helpers.ParseJwtTokenRs256(idToken, PublicKeyString)
	if err != nil {
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "idToken为空"))
		return
	}
	//logrus.Infoln("parsedClaims: ", parsedClaims)

	session, err := models.FindSessionByJwtId(clientID, parsedClaims.Subject, parsedClaims.ID)
	if err != nil || session == nil {
		gctx.JSON(http.StatusOK, models.ErrorResultMessage(err, "idToken为空4"))
		return
	}

	gctx.JSON(http.StatusOK, gin.H{
		"username":     session.Username,
		"id_token":     session.IdToken,
		"access_token": session.AccessToken,
	})
}

func checkClientSecret(ctx context.Context, client fosite.Client, clientSecret []byte) error {
	var err error
	err = fositeConfig.GetSecretsHasher(ctx).Compare(ctx, client.GetHashedSecret(), clientSecret)
	if err == nil {
		return nil
	}
	cc, ok := client.(fosite.ClientWithSecretRotation)
	if !ok {
		return err
	}
	for _, hash := range cc.GetRotatedHashes() {
		err = fositeConfig.GetSecretsHasher(ctx).Compare(ctx, hash, clientSecret)
		if err == nil {
			return nil
		}
	}

	return err
}
