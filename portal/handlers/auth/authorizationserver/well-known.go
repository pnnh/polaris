package authorizationserver

import (
	"fmt"

	"multiverse-authorization/helpers"

	"github.com/gin-gonic/gin"
)

func OpenIdConfigurationHandler(gctx *gin.Context) {
	issuer := helpers.GetIssure()
	resourcesServer := getUserServer()

	responseTemplate := `
	{
		"issuer": "%s",
		"authorization_endpoint": "%s/oauth2/auth",
		"device_authorization_endpoint": "%s/device/code",
		"token_endpoint": "%s/oauth2/token",
		"userinfo_endpoint": "%s/resources/userinfo",
		"revocation_endpoint": "%s/oauth2/revoke",
		"introspection_endpoint": "%s/oauth2/introspect",
		"jwks_uri": "%s/oauth2/jwks",
		"response_types_supported": [
			"code",
			"token",
			"id_token",
			"code token",
			"code id_token",
			"token id_token",
			"code token id_token",
			"none"
		],
		"subject_types_supported": [
			"public"
		],
		"id_token_signing_alg_values_supported": [
			"RS256"
		],
		"scopes_supported": [
			"openid",
			"email",
			"profile"
		],
		"token_endpoint_auth_methods_supported": [
			"client_secret_post",
			"client_secret_basic"
		],
		"claims_supported": [
			"aud",
			"email",
			"email_verified",
			"exp",
			"family_name",
			"given_name",
			"iat",
			"iss",
			"locale",
			"name",
			"picture",
			"sub"
		],
		"code_challenge_methods_supported": [
			"plain",
			"S256"
		],
		"grant_types_supported": [
			"authorization_code",
			"refresh_token"
		]
	}
	`

	responseText := fmt.Sprintf(responseTemplate, issuer, issuer, issuer, issuer,
		resourcesServer, issuer, issuer, issuer)
	gctx.Data(200, "application/json", []byte(responseText))
}
