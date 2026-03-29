package main

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"portal/business/account"
	"portal/business/account/userauth"
	"portal/business/channels"
	"portal/business/comments"
	"portal/business/tools"
	"portal/cloud/files"

	"github.com/pnnh/neutron/config"
	"github.com/pnnh/neutron/services/filesystem"

	"github.com/sirupsen/logrus"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type IResource interface {
	RegisterRouter(router *gin.Engine, name string)
}

type WebServer struct {
	router    *gin.Engine
	resources map[string]IResource
}

func checkCorsOrigin(origin string) bool {
	if config.Debug() {
		return true // 在调试模式下允许所有来源
	}
	if strings.HasSuffix(origin, "huable.xyz") {
		return true
	}
	return false
}

func NewWebServer() (*WebServer, error) {
	router := gin.Default()

	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	server := &WebServer{
		router:    router,
		resources: make(map[string]IResource)}

	router.Use(cors.New(cors.Config{
		AllowOriginFunc:  checkCorsOrigin,
		AllowMethods:     []string{"PUT", "PATCH", "POST", "GET"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Portal-Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	return server, nil
}
func devHandler(c *gin.Context) {
	scheme := "http"
	if c.Request.TLS != nil {
		scheme = "https"
	}
	fullURL := scheme + "://" + c.Request.Host + c.Request.URL.String()
	//fmt.Println("Full URL:", fullURL) // e.g., "http://localhost:8080/api/users?id=123"
	// Your logic here...
	userAgent := c.Request.Header.Get("User-Agent")
	//fmt.Println("User-Agent:", userAgent)
	// 要求在nodejs环境下只能够实用内部地址请求当前服务，因为CDN侧做了防护，生产环境无法请求
	if strings.Contains(userAgent, "node") && strings.Contains(fullURL, "huable.local") {
		logrus.Warnln("阻止通过服务器请求外部地址: ", fullURL, " ", userAgent)
		c.Abort()
	} else if !strings.Contains(fullURL, "huable.local") &&
		(!strings.Contains(userAgent, "node") && !strings.Contains(userAgent, "stargate")) {
		logrus.Warnln("阻止通过浏览器请求内部地址: ", fullURL, " ", userAgent)
		// 当从浏览器而非内部服务请求http://127.0.0.1等类似内部地址时阻止请求
		c.Abort()
	}
	c.Next()
}

func (s *WebServer) Init() error {
	//authHandler := &handlers.WebauthnHandler{}
	//s.router.POST("/account/signup/webauthn/begin/:username", authHandler.BeginRegistration)
	//s.router.POST("/account/signup/webauthn/finish/:username", authHandler.FinishRegistration)
	//s.router.POST("/account/signin/webauthn/begin/:username", authHandler.BeginLogin)
	//s.router.POST("/account/signin/webauthn/finish/:username", authHandler.FinishLogin)

	//if config.Debug() {
	//	s.router.Use(devHandler)
	//}

	s.router.Use(gin.Recovery())
	storageUrl, ok := config.GetConfigurationString("STORAGE_URL")
	if !ok || storageUrl == "" {
		return fmt.Errorf("STORAGE_URL 未配置2")
	}
	storagePath, err := filesystem.ResolvePath(storageUrl)
	if err != nil {
		return fmt.Errorf("解析路径失败: %w", err)
	}
	s.router.Static("/portal/storage", storagePath)

	s.router.POST("/portal/comments", comments.CommentInsertHandler)
	s.router.GET("/portal/comments", comments.CommentSelectHandler)
	//s.router.GET("/portal/articles", articles.NoteSelectHandler)
	//s.router.GET("/portal/articles/:uid", articles.NoteGetHandler)
	//s.router.GET("/portal/articles/:uid/assets", articles.NoteAssetsSelectHandler)
	//s.router.POST("/portal/articles/:uid/viewer", viewers.NoteViewerInsertHandler)
	s.router.GET("/portal/channels", channels.ChannelSelectHandler)
	s.router.GET("/portal/channels/complete", channels.ChannelCompleteHandler)
	s.router.GET("/portal/channels/:uid", channels.ChannelGetByUidHandler)

	s.router.POST("/portal/account/signup", account.SignupHandler)
	s.router.POST("/portal/account/signin", account.SigninHandler)
	s.router.POST("/portal/account/signout", account.SignoutHandler)
	s.router.GET("/portal/account/userinfo", account.UserinfoHandler)
	s.router.GET("/portal/account/session", account.SessionQueryHandler)
	s.router.GET("/portal/account/auth/app", account.AppQueryHandler)
	s.router.POST("/portal/account/auth/permit", account.PermitAppLoginHandler)
	s.router.GET("/portal/account/auth/userinfo", userauth.UserinfoHandler)

	//s.router.GET("/portal/images", images.ImageSelectHandler)
	//s.router.GET("/portal/images/:uid", images.ImageGetHandler)

	s.router.GET("/portal/tools", tools.ToolSelectHandler)

	s.router.GET("/portal/cloud/files", files.CloudFileSelectHandler)
	s.router.POST("/portal/cloud/files/:uid", files.CloudFileUpdateHandler)
	s.router.GET("/portal/cloud/files/path", files.CloudFilePathSelectHandler)
	s.router.GET("/portal/cloud/files/desc", files.CloudFileDescHandler)

	s.router.NoRoute(func(c *gin.Context) {
		path := c.Request.URL.Path
		logrus.Debugln("404路径: " + path)
		c.JSON(404, gin.H{"code": path + "PAGE_NOT_FOUND", "message": "Page not found"})
	})

	return nil
}

func (s *WebServer) Start() error {
	if err := s.Init(); err != nil {
		return fmt.Errorf("初始化出错: %w", err)
	}
	port := os.Getenv("PORT")
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

	logrus.Println("启动服务: " + port)
	if err := serv.ListenAndServe(); err != nil {
		return fmt.Errorf("服务出错停止: %w", err)
	}
	return nil
}

func (s *WebServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.router.ServeHTTP(w, r)
}
