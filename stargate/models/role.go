//go:generate generator
package models

import (
	"time"
)

// RoleModel table: roles
type RoleModel struct {
	Pk          string    `json:"pk"`
	Name        string    `json:"name"`
	CreateTime  time.Time `json:"create_time" db:"create_time"`
	UpdateTime  time.Time `json:"update_time" db:"update_time"`
	Description string    `json:"description"`
}
