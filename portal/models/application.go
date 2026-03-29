package models

import (
	"time"
)

type ApplicationModel struct {
	Pk             string    `json:"uid"` // 主键标识
	Id             string    `json:"id"`  // 账号
	Secret         string    `json:"-"`
	RotatedSecrets string    `json:"-" db:"rotated_secrets"`
	RedirectUris   string    `json:"-" db:"redirect_uris"`
	ResponseTypes  string    `json:"-" db:"response_types"`
	GrantTypes     string    `json:"-" db:"grant_types"`
	Scopes         string    `json:"-"`
	Audience       string    `json:"-"`
	Creator        string    `json:"creator"`
	Title          string    `json:"title"`
	CreateTime     time.Time `json:"create_time" db:"create_time"`
	UpdateTime     time.Time `json:"update_time" db:"update_time"`
	Description    string    `json:"description"`
	Public         int       `json:"public"`
	SiteUrl        string    `json:"site_url" db:"site_url"`
	Status         int       `json:"status"`
	Image          string    `json:"image"`
	Rank           int       `json:"rank"`
}
