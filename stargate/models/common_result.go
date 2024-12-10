package models

import "github.com/sirupsen/logrus"

type CommonResult struct {
	Code    MCode       `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func NewCommonResult(code MCode, message string, data interface{}) *CommonResult {
	return &CommonResult{Code: code, Message: message, Data: data}
}

func ParseCommonResult(data interface{}) *CommonResult {
	if data == nil {
		return nil
	}
	if result, ok := data.(*CommonResult); ok {
		return result
	}
	return nil
}

func (r *CommonResult) SetCode(code MCode) *CommonResult {
	r.Code = code
	return r
}

func (r *CommonResult) SetMessage(message string) *CommonResult {
	r.Message = message
	return r
}

func (r *CommonResult) SetData(data interface{}) *CommonResult {
	r.Data = data
	return r
}

// 成功时响应
func SuccessResult(data any) *CommonResult {
	return NewCommonResult(CodeOk, CodeMessage(CodeOk), data)
}

// 成功时响应，附加消息
func SuccessResultMessage(data any, message string) *CommonResult {
	return NewCommonResult(CodeOk, message, data)
}

// 错误时响应
func ErrorResult(err error) *CommonResult {
	return ErrorResultFull(err, CodeError, "", nil)
}

// 错误时响应，指定错误提示消息
func ErrorResultMessage(err error, message string) *CommonResult {
	return ErrorResultFull(err, CodeError, message, err)
}

// 错误时响应，指定响应码
func ErrorResultCode(err error, bizCode MCode) *CommonResult {
	return ErrorResultFull(err, bizCode, "", nil)
}

// 错误时响应，附带额外数据
func ErrorResultFull(err error, bizCode MCode, message string, data any) *CommonResult {
	logrus.Errorf("MCode.WithError [%d] %v", bizCode, err)
	if message == "" {
		message = CodeMessage(bizCode)
	}
	return NewCommonResult(bizCode, message, data)
}
