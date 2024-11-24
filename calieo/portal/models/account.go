//go:generate generator

package models

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"time"

	"multiverse-authorization/neutron/server/helpers"
	"multiverse-authorization/neutron/services/datastore"

	"github.com/go-webauthn/webauthn/webauthn"
	"github.com/jmoiron/sqlx"
)

// AccountModel 账号模型 table: accounts
type AccountModel struct {
	Pk          string    `json:"pk"`       // 主键标识
	Username    string    `json:"username"` // 账号
	Password    string    `json:"-"`        // 密码
	Photo       string    `json:"-"`        // 密码
	CreateTime  time.Time `json:"create_time" db:"create_time"`
	UpdateTime  time.Time `json:"update_time" db:"update_time"`
	Nickname    string    `json:"nickname"`
	Mail        string    `json:"mail"`
	Credentials string    `json:"-"`
	Session     string    `json:"-"`
	Description string    `json:"description"`
	Status      int       `json:"status"`
}

func NewAccountModel(name string, displayName string) *AccountModel {
	user := &AccountModel{
		Pk:         helpers.NewPostId(),
		Username:   name,
		CreateTime: time.Now(),
		UpdateTime: time.Now(),
		Nickname:   displayName,
	}

	return user
}

func GetAccount(pk string) (*AccountModel, error) {
	sqlText := `select * from portal.accounts where pk = :pk and status = 1;`

	sqlParams := map[string]interface{}{"pk": pk}
	var sqlResults []*AccountModel

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

func GetAccountByUsername(username string) (*AccountModel, error) {
	sqlText := `select *
	from portal.accounts where username = :username and status = 1;`

	sqlParams := map[string]interface{}{"username": username}
	var sqlResults []*AccountModel

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

func PutAccount(model *AccountModel) error {
	sqlText := `insert into portal.accounts(pk, create_time, update_time, username, password, nickname, status, session)
	values(:pk, :create_time, :update_time, :username, :password, :nickname, 1, :session)`

	sqlParams := map[string]interface{}{"pk": model.Pk, "create_time": model.CreateTime, "update_time": model.UpdateTime,
		"username": model.Username, "password": model.Password, "nickname": model.Nickname,
		"session": model.Session}

	_, err := datastore.NamedExec(sqlText, sqlParams)
	if err != nil {
		return fmt.Errorf("PutAccount: %w", err)
	}
	return nil
}

func SelectAccounts(offset int, limit int) ([]*AccountModel, error) {
	sqlText := `select * from portal.accounts offset :offset limit :limit;`

	sqlParams := map[string]interface{}{"offset": offset, "limit": limit}
	var sqlResults []*AccountModel

	rows, err := datastore.NamedQuery(sqlText, sqlParams)
	if err != nil {
		return nil, fmt.Errorf("NamedQuery: %w", err)
	}
	if err = sqlx.StructScan(rows, &sqlResults); err != nil {
		return nil, fmt.Errorf("StructScan: %w", err)
	}

	return sqlResults, nil
}

func CountAccounts() (int64, error) {
	sqlText := `select count(1) as count from portal.accounts;`

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

func UpdateAccountSession(model *AccountModel, sessionData *webauthn.SessionData) error {
	sessionBytes, err := json.Marshal(sessionData)
	if err != nil {
		return fmt.Errorf("序列化sessionData出错: %s", err)
	}
	sessionText := base64.StdEncoding.EncodeToString(sessionBytes)
	model.Session = sessionText

	if model.Session == "" {
		return fmt.Errorf("session is null")
	}
	sqlText := `update portal.accounts set session = :session where pk = :pk;`

	sqlParams := map[string]interface{}{"pk": model.Pk, "session": model.Session}

	_, err = datastore.NamedExec(sqlText, sqlParams)
	if err != nil {
		return fmt.Errorf("UpdateAccountSession: %w", err)
	}
	return nil
}

func UnmarshalWebauthnSession(session string) (*webauthn.SessionData, error) {
	sessionBytes, err := base64.StdEncoding.DecodeString(session)
	if err != nil {
		return nil, fmt.Errorf("反序列化session出错: %s", err)
	}
	sessionData := &webauthn.SessionData{}
	if err := json.Unmarshal(sessionBytes, sessionData); err != nil {
		return nil, fmt.Errorf("反序列化sessionData出错: %s", err)
	}
	return sessionData, nil
}

func UpdateAccountPassword(pk string, password string) error {
	sqlText := `update portal.accounts set password = :password where pk = :pk;`

	sqlParams := map[string]interface{}{"pk": pk, "password": password}

	_, err := datastore.NamedExec(sqlText, sqlParams)
	if err != nil {
		return fmt.Errorf("UpdateAccountPassword: %w", err)
	}
	return nil
}
