package models

import (
	"fmt"
	"time"

	"multiverse-authorization/neutron/server/helpers"
	"multiverse-authorization/neutron/services/datastore"

	"github.com/jmoiron/sqlx"
)

type ApplicationModel struct {
	Pk             string    `json:"pk"` // 主键标识
	Id             string    `json:"id"` // 账号
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

func NewApplicationModel(title string) *ApplicationModel {
	model := &ApplicationModel{
		Pk:         helpers.NewPostId(),
		Title:      title,
		CreateTime: time.Now(),
		UpdateTime: time.Now(),
	}

	return model
}

func GetApplication(pk string) (*ApplicationModel, error) {
	sqlText := `select * from portal.applications where pk = :pk;`

	sqlParams := map[string]interface{}{"pk": pk}
	var sqlResults []*ApplicationModel

	rows, err := datastore.NamedQuery(sqlText, sqlParams)
	if err != nil {
		return nil, fmt.Errorf("NamedQuery: %w", err)
	}
	if err = sqlx.StructScan(rows, &sqlResults); err != nil {
		return nil, fmt.Errorf("StructScan: %w", err)
	}

	for _, v := range sqlResults {
		return v, nil
	}

	return nil, nil
}

func SelectApplications(offset int, limit int) ([]*ApplicationModel, error) {
	sqlText := `select * from portal.applications offset :offset limit :limit;`

	sqlParams := map[string]interface{}{"offset": offset, "limit": limit}
	var sqlResults []*ApplicationModel

	rows, err := datastore.NamedQuery(sqlText, sqlParams)
	if err != nil {
		return nil, fmt.Errorf("NamedQuery: %w", err)
	}
	if err = sqlx.StructScan(rows, &sqlResults); err != nil {
		return nil, fmt.Errorf("StructScan: %w", err)
	}

	return sqlResults, nil
}

func SelectApplicationsByStatus(status int) ([]*ApplicationModel, error) {
	sqlText := `select * from portal.applications where status = :status and rank > 0 order by rank;`

	sqlParams := map[string]interface{}{"status": status}
	var sqlResults []*ApplicationModel

	rows, err := datastore.NamedQuery(sqlText, sqlParams)
	if err != nil {
		return nil, fmt.Errorf("SelectApplicationsByStatus: %w", err)
	}
	if err = sqlx.StructScan(rows, &sqlResults); err != nil {
		return nil, fmt.Errorf("SelectApplicationsByStatus: %w", err)
	}

	return sqlResults, nil
}

func CountApplications() (int64, error) {
	sqlText := `select count(1) as count from portal.applications;`

	sqlParams := map[string]interface{}{}
	var sqlResults []struct {
		Count int64 `db:"count"`
	}

	rows, err := datastore.NamedQuery(sqlText, sqlParams)
	if err != nil {
		return 0, fmt.Errorf("NamedQuery: %w", err)
	}
	if err = sqlx.StructScan(rows, &sqlResults); err != nil {
		return 0, fmt.Errorf("StructScan: %w", err)
	}
	if len(sqlResults) == 0 {
		return 0, nil
	}

	return sqlResults[0].Count, nil
}
