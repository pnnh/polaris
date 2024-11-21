package models

import (
	"fmt"

	"github.com/sirupsen/logrus"
)

type MCode int

func (c MCode) String() string {
	return fmt.Sprintf("%d", c)
}

// Deprecated: 使用SuccessResult或ErrorResult系列方法替代
// func (c MCode) ToResult() *CommonResult {
// 	return NewCommonResult(c, CodeMessage(c), nil)
// }

// Deprecated: 使用SuccessResult或ErrorResult系列方法替代
func (c MCode) WithMessage(message string) *CommonResult {
	return NewCommonResult(c, CodeMessage(c)+":"+message, nil)
}

// Deprecated: 使用SuccessResult或ErrorResult系列方法替代
func (c MCode) WithData(data interface{}) *CommonResult {
	return NewCommonResult(c, CodeMessage(c), data)
}

// Deprecated: 使用SuccessResult或ErrorResult系列方法替代
func (c MCode) WithError(err error) *CommonResult {
	logrus.Errorf("MCode.WithError [%d] %v", c, err)
	return NewCommonResult(c, CodeMessage(c), nil)
}

const (
	CodeOk               MCode = 200
	CodeError            MCode = 500
	CodeAccountExists    MCode = 600 // 账号已存在
	CodeAccountNotExists MCode = 601 // 账号不存在
	CodeNotLogin         MCode = 602
	CodeInvalidParameter MCode = 603
	CodeNotFound         MCode = 404
	StatusAccountExists  MCode = 607 // 账号已存在
	CodeInvalidParams    MCode = 609 // 参数无效
)

func CodeMessage(code MCode) string {
	switch code {
	case CodeOk:
		return "成功"
	case CodeNotFound:
		return "资源未找到"
	case CodeAccountNotExists:
		return "账号不存在"
	case CodeNotLogin:
		return "尚未登陆"
	case StatusAccountExists:
		return "账号已存在"
	}
	return fmt.Sprintf("未知错误：%d", code)
}
