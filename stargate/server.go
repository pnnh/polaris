package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"multiverse-authorization/handlers"
	"multiverse-authorization/handlers/account"
	"multiverse-authorization/handlers/auth/authorizationserver"
	"multiverse-authorization/handlers/captcha"
	"multiverse-authorization/handlers/console"
	"multiverse-authorization/handlers/permissions"
	"multiverse-authorization/handlers/public"
	"multiverse-authorization/handlers/roles"
	"multiverse-authorization/neutron/config"

	"github.com/gin-gonic/gin"
)

type IResource interface {
	RegisterRouter(router *gin.Engine, name string)
}

type WebServer struct {
	router    *gin.Engine
	resources map[string]IResource
}

func NewWebServer() (*WebServer, error) {
	router := gin.Default()

	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	server := &WebServer{
		router:    router,
		resources: make(map[string]IResource)}

	webUrl, _ := config.GetConfigurationString("WEB_URL")
	if webUrl == "" {
		return nil, fmt.Errorf("SELF_URL未配置")
	}
	corsDomain := []string{webUrl}

	router.Use(cors.New(cors.Config{
		AllowOrigins:     corsDomain,
		AllowMethods:     []string{"PUT", "PATCH", "POST", "GET"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Portal-Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	return server, nil
}

func (s *WebServer) Init() error {
	indexHandler := handlers.NewIndexHandler()
	s.router.GET("/", indexHandler.Query)

	authHandler := &handlers.WebauthnHandler{}
	s.router.POST("/account/signup/webauthn/begin/:username", authHandler.BeginRegistration)
	s.router.POST("/account/signup/webauthn/finish/:username", authHandler.FinishRegistration)
	s.router.POST("/account/signin/webauthn/begin/:username", authHandler.BeginLogin)
	s.router.POST("/account/signin/webauthn/finish/:username", authHandler.FinishLogin)

	// s.router.POST("/account/signup/email/begin", account.MailSignupBeginHandler)
	// s.router.POST("/account/signup/email/finish", account.MailSignupFinishHandler)
	// s.router.POST("/account/signin/email/begin", account.MailSigninBeginHandler)
	// s.router.POST("/account/signin/email/finish", account.MailSigninFinishHandler)

	//s.router.POST("/account/signup/password/begin", account.PasswordSignupBeginHandler)
	s.router.POST("/account/signup/password/finish", account.PasswordSignupFinishHandler)
	//s.router.POST("/account/signin/password/begin", account.PasswordSigninBeginHandler)
	s.router.POST("/account/signin/password/finish", account.PasswordSigninFinishHandler)

	s.router.GET("/console/accounts", console.AdminSelectAccounts)
	s.router.GET("/console/accounts/:pk", console.AdminSelectAccounts)

	s.router.GET("/console/applications", console.ApplicationSelectHandler)
	s.router.GET("/public/applications", public.PublicApplicationSelectHandler)

	s.router.GET("/console/roles", roles.RoleSelectHandler)
	s.router.GET("/console/roles/:pk", roles.RoleGetHandler)

	s.router.GET("/console/permissions", permissions.PermissionSelectHandler)

	// sessionHandler := &handlers.SessionHandler{}
	// s.router.POST("/account/session/introspect", sessionHandler.Introspect)

	s.router.GET("/oauth2/auth", func(gctx *gin.Context) {
		authorizationserver.AuthEndpointHtml(gctx)
	})
	s.router.POST("/oauth2/auth", func(gctx *gin.Context) {
		authorizationserver.AuthEndpointJson(gctx)
	})

	s.router.POST("/oauth2/token", authorizationserver.TokenEndpoint)
	s.router.POST("/oauth2/revoke", func(gctx *gin.Context) {
		authorizationserver.RevokeEndpoint(gctx)
	})
	s.router.POST("/oauth2/introspect", func(gctx *gin.Context) {
		authorizationserver.IntrospectionEndpoint(gctx)
	})
	s.router.GET("/oauth2/jwks", func(gctx *gin.Context) {
		authorizationserver.JwksEndpoint(gctx)
	})
	s.router.POST("/oauth2/user", func(gctx *gin.Context) {
		authorizationserver.UserEndpoint(gctx)
	})

	s.router.GET("/.well-known/openid-configuration", authorizationserver.OpenIdConfigurationHandler)

	s.router.GET("/api/go_captcha_data", captcha.GetCaptchaData)
	s.router.POST("/api/go_captcha_check_data", captcha.CheckCaptcha)

	return nil
}

func (s *WebServer) Start() error {
	if err := s.Init(); err != nil {
		return fmt.Errorf("初始化出错: %w", err)
	}
	port := os.Getenv("port")
	if len(port) < 1 {
		port = "8001"
	}
	var handler http.Handler = s

	serv := &http.Server{
		Addr:           ":" + port,
		Handler:        handler,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	if err := serv.ListenAndServe(); err != nil {
		return fmt.Errorf("服务出错停止: %w", err)
	}
	return nil
}

func (s *WebServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.router.ServeHTTP(w, r)
}
