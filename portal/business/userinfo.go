package business

import (
	"errors"
	"fmt"
	"net/http"
	"strings"

	"portal/models"

	"github.com/pnnh/neutron/config"
	"github.com/pnnh/neutron/helpers"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

const AuthCookieName = "PT"

func FindSessionFromToken(authToken string) (*models.SessionModel, error) {
	jwtId := ""
	if authToken != "" {
		jwtPublicKey, ok := config.GetConfigurationString("JWT_PUBLIC_KEY")
		if !ok || jwtPublicKey == "" {
			return nil, fmt.Errorf("JWT_PUBLIC_KEY 未配置")
		}
		jwtToken := strings.TrimPrefix(authToken, "Bearer ")
		parsedClaims, err := helpers.ParseJwtTokenRs256(jwtToken, jwtPublicKey)
		if err != nil && !errors.Is(err, jwt.ErrTokenExpired) {
			return nil, fmt.Errorf("解析jwtToken失败: %s", err)
		}
		if parsedClaims != nil {
			jwtId = parsedClaims.ID
		}
	}
	//// 用户未登录时返回匿名会话
	//if jwtId == "" {
	//	addr := helpers.GetIpAddress(gctx)
	//	nowSession, err := models.GetSessionByAddress(addr)
	//	if err != nil {
	//		logrus.Warnln("GetSessionByAddress", err)
	//		return nil, fmt.Errorf("查询会话出错")
	//	}
	//	if nowSession != nil {
	//		return nowSession, nil
	//	}
	//
	//	newSessionModel := &models.SessionModel{
	//		Uid:          helpers.MustUuid(),
	//		Content:      "",
	//		CreateTime:   time.Now(),
	//		UpdateTime:   time.Now(),
	//		Username:     models.AnonymousAccount.Username,
	//		Type:         "anonymous",
	//		Code:         "",
	//		ClientId:     "",
	//		ResponseType: "",
	//		RedirectUri:  "",
	//		Scope:        "",
	//		State:        "",
	//		Nonce:        "",
	//		IdToken:      "",
	//		AccessToken:  "",
	//		JwtId:        "",
	//		Account:      models.AnonymousAccount.Uid,
	//		Address:      addr,
	//	}
	//	err = models.PutSession(newSessionModel)
	//	if err != nil {
	//		logrus.Println("PutSession", err)
	//		return nil, fmt.Errorf("写入匿名会话出错")
	//	}
	//
	//	return newSessionModel, nil
	//}

	sessionModel, err := models.GetSessionById(jwtId)
	if err != nil {
		return nil, fmt.Errorf("查询用户会话出错: %s", err)
	}

	return sessionModel, nil
}

func FindAccountFromCookie(gctx *gin.Context) (*models.AccountModel, error) {
	authCookie, err := gctx.Request.Cookie(AuthCookieName)
	if err != nil && !errors.Is(err, http.ErrNoCookie) {
		return nil, fmt.Errorf("获取cookie失败: %s", err)
	}
	if authCookie == nil || authCookie.Value == "" {
		if config.Debug() {
			debugQuery := gctx.Query("debug")
			debugHeader := gctx.GetHeader("debug")
			if debugQuery == "true" || debugHeader == "true" {
				return models.DebugAccount, nil
			}
		}
		return models.AnonymousAccount, nil
	}

	sessionModel, err := FindSessionFromToken(authCookie.Value)
	if err != nil {
		return nil, fmt.Errorf("查询用户会话出错: %s", err)
	}
	if sessionModel == nil || sessionModel.Type == "anonymous" {
		return models.AnonymousAccount, nil
	}
	accountModel, err := models.GetAccountBySessionId(sessionModel.Uid)
	if err != nil {
		return nil, fmt.Errorf("查询用户账户出错: %s", err)
	}
	if accountModel == nil {
		return nil, fmt.Errorf("用户账户不存在")
	}
	return accountModel, nil
}

func FindAccountFromToken(authToken string) (*models.AccountModel, error) {
	if authToken == "" {
		return models.AnonymousAccount, nil
	}

	sessionModel, err := FindSessionFromToken(authToken)
	if err != nil {
		return nil, fmt.Errorf("查询用户会话出错2: %s", err)
	}
	if sessionModel == nil || sessionModel.Type == "anonymous" {
		return models.AnonymousAccount, nil
	}
	accountModel, err := models.GetAccountBySessionId(sessionModel.Uid)
	if err != nil {
		return nil, fmt.Errorf("查询用户账户出错2: %s", err)
	}
	if accountModel == nil {
		return nil, fmt.Errorf("用户账户不存在2")
	}
	return accountModel, nil
}
