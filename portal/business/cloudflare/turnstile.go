package cloudflare

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/pnnh/neutron/config"
	"github.com/sirupsen/logrus"
)

type TurnstileModel struct {
	TurnstileToken string `json:"turnstile_token"`
}

type TurnstileResponse struct {
	Success bool `json:"success"`
}

func VerifyTurnstileToken(token string, ipAddr string) (bool, error) {
	if token == "" || ipAddr == "" {
		return false, fmt.Errorf("token or ipAddr is empty")
	}
	posturl := "https://challenges.cloudflare.com/turnstile/v0/siteverify"

	turnstileSecret, ok := config.GetConfigurationString("CLOUDFLARE_TURNSTILE_SECRET")
	if !ok || turnstileSecret == "" {
		logrus.Errorln("CLOUDFLARE_TURNSTILE_SECRET 未配置")
	}

	var formData = url.Values{}
	formData.Set("secret", turnstileSecret)
	formData.Set("response", token)
	formData.Set("remoteip", ipAddr)
	var payload = bytes.NewBufferString(formData.Encode())

	newRequest, err := http.NewRequest("POST", posturl, payload)
	if err != nil {
		return false, fmt.Errorf("http.NewRequest: %w", err)
	}

	newRequest.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	res, err := client.Do(newRequest)
	if err != nil {
		return false, fmt.Errorf("client.Do: %w", err)
	}

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			logrus.Println("关闭Body失败", err)
		}
	}(res.Body)

	post := &TurnstileResponse{}
	derr := json.NewDecoder(res.Body).Decode(post)
	if derr != nil {
		return false, fmt.Errorf("json.NewDecoder: %w", derr)
	}

	return post.Success, nil
}
