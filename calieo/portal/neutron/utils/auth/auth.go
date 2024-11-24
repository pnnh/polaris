package auth

import (
	"errors"
	"fmt"
	"time"
 
	"github.com/golang-jwt/jwt" 
)
 
func ParseToken(token string, jwtKey string) (string, error) {
	j := NewJWT(jwtKey)
	claims, err := j.ParseToken(token)
	if err != nil {
		return "", fmt.Errorf("parse出错: %w", err)
	}
	return claims.User, nil
}

// 生成令牌
func GenerateToken(user string, jwtKey, Issuer string) (string, error) {
	j := &JWT{
		[]byte(jwtKey),
	}
	nowUnix := time.Now().Unix()
	claims := CustomClaims{
		StandardClaims: jwt.StandardClaims{
			NotBefore: nowUnix - 1000, // 签名生效时间
			ExpiresAt: nowUnix + 3600 * 24 * 7, // 过期时间
			Issuer:    Issuer,                    //签名的发行者
		},
		User: user,
	}

	token, err := j.CreateToken(claims)

	if err != nil {
		return "", err
	}
	return token, nil
}

// JWT 签名结构
type JWT struct {
	SigningKey []byte
}

// 一些常量
var (
	TokenExpired     error  = errors.New("Token is expired")
	TokenNotValidYet error  = errors.New("Token not active yet")
	TokenMalformed   error  = errors.New("That's not even a token")
	TokenInvalid     error  = errors.New("Couldn't handle this token:")
)

// 载荷，可以加一些自己需要的信息
type CustomClaims struct {
	jwt.StandardClaims
	User string
}

// 新建一个jwt实例
func NewJWT(jwtKey string) *JWT {
	return &JWT{
		[]byte(jwtKey),
	}
}

// CreateToken 生成一个token
func (j *JWT) CreateToken(claims CustomClaims) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(j.SigningKey)
}

// 解析Token
func (j *JWT) ParseToken(tokenString string) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return j.SigningKey, nil
	})
	if err != nil {
		if ve, ok := err.(*jwt.ValidationError); ok {
			if ve.Errors&jwt.ValidationErrorMalformed != 0 {
				return nil, TokenMalformed
			} else if ve.Errors&jwt.ValidationErrorExpired != 0 {
				// Token is expired
				return nil, TokenExpired
			} else if ve.Errors&jwt.ValidationErrorNotValidYet != 0 {
				return nil, TokenNotValidYet
			} else {
				return nil, TokenInvalid
			}
		}
		return nil, err
	}
	if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, TokenInvalid
}

// 更新token
func (j *JWT) RefreshToken(tokenString string) (string, error) {
	jwt.TimeFunc = func() time.Time {
		return time.Unix(0, 0)
	}
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return j.SigningKey, nil
	})
	if err != nil {
		return "", err
	}
	if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
		jwt.TimeFunc = time.Now
		claims.StandardClaims.ExpiresAt = time.Now().Add(1 * time.Hour).Unix()
		return j.CreateToken(*claims)
	}
	return "", TokenInvalid
}
