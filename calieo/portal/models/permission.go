//go:generate generator

package models

import (
	"time"
)

// PermissionModel 权限模型 table: permissions
type PermissionModel struct {
	Pk          string    `json:"pk"`
	Name        string    `json:"name"`
	CreateTime  time.Time `json:"create_time" db:"create_time"`
	UpdateTime  time.Time `json:"update_time" db:"update_time"`
	Description string    `json:"description"`
}
