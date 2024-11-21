package main

import (
	"multiverse-authorization/handlers"
	"multiverse-authorization/handlers/auth/authorizationserver"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"multiverse-authorization/neutron/config"
	"multiverse-authorization/neutron/services/datastore"
)

func main() {
	if config.Debug() {
		gin.SetMode(gin.DebugMode)
		logrus.SetLevel(logrus.DebugLevel)
	} else {
		gin.SetMode(gin.ReleaseMode)
		logrus.SetLevel(logrus.InfoLevel)
	}

	handlers.InitWebauthn()
	authorizationserver.InitOAuth2()

	accountDSN, ok := config.GetConfiguration("ACCOUNT_DB")
	if !ok || accountDSN == nil {
		logrus.Errorln("ACCOUNT_DB未配置")
	}

	if err := datastore.Init(accountDSN.(string)); err != nil {
		logrus.Fatalln("datastore: ", err)
	}

	webServer, err := NewWebServer()
	if err != nil {
		logrus.Fatalln("创建web server出错", err)
	}

	if err := webServer.Start(); err != nil {
		logrus.Fatalln("应用程序执行出错: %w", err)
	}
}
