package authorizationserver

import (
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"time"

	"multiverse-authorization/helpers"

	"github.com/ory/fosite"
	"github.com/ory/fosite/compose"
	"github.com/ory/fosite/handler/openid"
	"github.com/ory/fosite/token/jwt"
	"github.com/sirupsen/logrus"
	"multiverse-authorization/neutron/config"
)

var (
	fositeConfig = &fosite.Config{
		AccessTokenLifespan: time.Hour * 72,
		GlobalSecret:        secret,
	}

	fositeStore = NewDatabaseStore()

	secret = []byte("some-cool-secret-that-is-32bytes")

	PublicKeyString  = ""
	PrivateKeyString = ""
	PrivateKey       *rsa.PrivateKey
)

func InitOAuth2() {
	privStr, ok := config.GetConfiguration("OAUTH2_PRIVATE_KEY")
	if !ok {
		logrus.Fatalln("private key error22!")
	}
	PrivateKeyString = privStr.(string)

	pubStr, ok := config.GetConfiguration("OAUTH2_PUBLIC_KEY")
	if !ok {
		logrus.Fatalln("public key error22!")
	}
	PublicKeyString = pubStr.(string)

	block, _ := pem.Decode([]byte(PrivateKeyString)) //将密钥解析成私钥实例
	if block == nil {
		logrus.Fatalln("private key error333!")
	}
	priv, err := x509.ParsePKCS1PrivateKey(block.Bytes) //解析pem.Decode（）返回的Block指针实例
	if err != nil {
		logrus.Fatalln("privateKeyBytes", err)
	}
	PrivateKey = priv

	oauth2 = compose.ComposeAllEnabled(fositeConfig, fositeStore, PrivateKey)
}

var oauth2 fosite.OAuth2Provider

func getUserServer() string {
	issure := config.MustGetConfigurationString("SELF_URL")
	return issure
}

func newSession(user string) *openid.DefaultSession {
	issure := helpers.GetIssure()
	return &openid.DefaultSession{
		Claims: &jwt.IDTokenClaims{
			Issuer:      issure,
			Subject:     user,
			Audience:    []string{},
			ExpiresAt:   time.Now().Add(time.Hour * 72),
			IssuedAt:    time.Now(),
			RequestedAt: time.Now(),
			AuthTime:    time.Now(),
		},
		Subject:  user,
		Username: user,
		Headers: &jwt.Headers{
			Extra: make(map[string]interface{}),
		},
	}
}
