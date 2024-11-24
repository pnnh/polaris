package email

import (
	"fmt"

	"golang.org/x/time/rate"
	"multiverse-authorization/neutron/config"

	gomail "gopkg.in/gomail.v2"
)

var dialer *gomail.Dialer
var limiter *rate.Limiter = &rate.Limiter{}

func init() {
	mailHost := config.MustGetConfigurationString("MAIL_HOST")
	mailPort := config.GetConfigOrDefaultInt64("MAIL_PORT", 587)
	mailUser := config.MustGetConfigurationString("MAIL_USER")
	mailPassword := config.MustGetConfigurationString("MAIL_PASSWORD")
	d := gomail.NewDialer(mailHost, int(mailPort), mailUser, mailPassword)
	dialer = d

	limiter = rate.NewLimiter(1, 1)
}

func SendMail(from, subject, mailBody string, to ...string) error {
	if !limiter.Allow() {
		return fmt.Errorf("邮件发送频率过高")
	}
	m := gomail.NewMessage()
	m.SetHeader("From", from)
	m.SetHeader("To", to...)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", mailBody)

	return dialer.DialAndSend(m)
}
