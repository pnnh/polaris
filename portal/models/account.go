//go:generate generator

package models

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"time"

	"github.com/pnnh/neutron/helpers"
	"github.com/pnnh/neutron/services/datastore"

	"github.com/go-webauthn/webauthn/webauthn"
	"github.com/jmoiron/sqlx"
)

// 基础的账号模型信息
type AccountModel struct {
	Uid         string    `json:"uid"` // 主键标识
	Username    string    `json:"-"`   // 账号
	Password    string    `json:"-"`   // 密码
	Photo       string    `json:"photo"`
	CreateTime  time.Time `json:"create_time" db:"create_time"`
	UpdateTime  time.Time `json:"update_time" db:"update_time"`
	Nickname    string    `json:"nickname"`
	EMail       string    `json:"email"`
	Credentials string    `json:"-"`
	Session     string    `json:"-"`
	Description string    `json:"description"`
	Status      int       `json:"status"`
	Website     string    `json:"website"`
	Fingerprint string    `json:"fingerprint"`
}

// 当登录用户获取自己的信息时返回这个模型
type SelfAccountModel struct {
	AccountModel
	Username string `json:"username"` // 用户名称
}

var AnonymousAccount = &AccountModel{
	Uid:         "00000000-0000-0000-0000-000000000000",
	Username:    "anonymous",
	Password:    "",
	CreateTime:  time.Unix(0, 0),
	UpdateTime:  time.Unix(0, 0),
	Nickname:    "匿名用户",
	EMail:       "",
	Credentials: "",
	Session:     "",
	Description: "",
	Status:      0,
	Website:     "",
	Fingerprint: "",
}

var RootAccount = &AccountModel{
	Uid:         "01990e6a-2689-731b-a5a2-b46117e22040",
	Username:    "root",
	Password:    "",
	CreateTime:  time.Unix(0, 0),
	UpdateTime:  time.Unix(0, 0),
	Nickname:    "根用户",
	EMail:       "",
	Credentials: "",
	Session:     "",
	Description: "",
	Status:      0,
	Website:     "",
	Fingerprint: "",
}

var DebugAccount = &AccountModel{
	Uid:        "019c93b4-6475-711b-8144-fdc94ffa0edc",
	Username:   "debug",
	Password:   "",
	CreateTime: time.Unix(0, 0),
	UpdateTime: time.Unix(0, 0),
	Nickname:   "调试用户",
}

func NewAccountModel(name string, displayName string) *AccountModel {
	user := &AccountModel{
		Uid:        helpers.NewPostId(),
		Username:   name,
		CreateTime: time.Now(),
		UpdateTime: time.Now(),
		Nickname:   displayName,
	}

	return user
}

func (user *AccountModel) IsAnonymous() bool {
	return user.Uid == "00000000-0000-0000-0000-000000000000"
}

func GetAccount(uid string) (*AccountModel, error) {
	// 匿名用户
	if uid == "00000000-0000-0000-0000-000000000000" {
		return AnonymousAccount, nil
	}
	sqlText := `select * from accounts where uid = :uid;`

	sqlParams := map[string]interface{}{"uid": uid}
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
	sqlText := `select * from accounts where username = :username limit 1;`

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

func GetAccountBySessionId(sessionId string) (*AccountModel, error) {

	sqlText := `select a.* from accounts as a join sessions as s on a.uid = s.account where s.uid = :uid limit 1;`

	sqlParams := map[string]interface{}{"uid": sessionId}
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
	sqlText := `insert into accounts(pk, create_time, update_time, username, password, nickname, status, session)
	values(:uid, :create_time, :update_time, :username, :password, :nickname, 1, :session)`

	sqlParams := map[string]interface{}{"uid": model.Uid, "create_time": model.CreateTime, "update_time": model.UpdateTime,
		"username": model.Username, "password": model.Password, "nickname": model.Nickname,
		"session": model.Session}

	_, err := datastore.NamedExec(sqlText, sqlParams)
	if err != nil {
		return fmt.Errorf("PutAccount: %w", err)
	}
	return nil
}

func UpdateAccountInfo(model *AccountModel) error {
	sqlText := `update accounts set nickname = :nickname, email = :email,
                    description = :description, photo = :photo
where uid = :uid;`

	sqlParams := map[string]interface{}{
		"uid":         model.Uid,
		"nickname":    model.Nickname,
		"email":       model.EMail,
		"description": model.Description,
		"photo":       model.Photo,
	}

	_, err := datastore.NamedExec(sqlText, sqlParams)
	if err != nil {
		return fmt.Errorf("UpdateAccountInfo: %w", err)
	}
	return nil
}

func SelectAccounts(offset int, limit int) ([]*AccountModel, error) {
	sqlText := `select * from accounts offset :offset limit :limit;`

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
	sqlText := `select count(1) as count from accounts;`

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
	sqlText := `update accounts set session = :session where pk = :uid;`

	sqlParams := map[string]interface{}{"uid": model.Uid, "session": model.Session}

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
	sqlText := `update accounts set password = :password where pk = :uid;`

	sqlParams := map[string]interface{}{"uid": pk, "password": password}

	_, err := datastore.NamedExec(sqlText, sqlParams)
	if err != nil {
		return fmt.Errorf("UpdateAccountPassword: %w", err)
	}
	return nil
}

func CheckAccountExists(username string) (bool, error) {

	sqlText := `select count(1) as count from accounts where username = :username;`

	sqlParams := map[string]interface{}{"username": username}

	var sqlResults []struct {
		Count int `db:"count"`
	}

	rows, err := datastore.NamedQuery(sqlText, sqlParams)
	if err != nil {
		return false, fmt.Errorf("NamedQuery: %w", err)
	}
	if err = sqlx.StructScan(rows, &sqlResults); err != nil {
		return false, fmt.Errorf("StructScan: %w", err)
	}
	if len(sqlResults) == 0 {
		return false, nil
	}

	return sqlResults[0].Count > 0, nil
}

func EnsureAccount(model *AccountModel) error {
	sqlText := `insert into accounts(uid, username, password, nickname, create_time, update_time, email, website, photo, fingerprint)
values (:uid, :username, :password, :nickname, now(), now(), :email, :website, :photo, :fingerprint)
on conflict (username)
do update set nickname = excluded.nickname,
    email = excluded.email, update_time = now();`

	sqlParams := map[string]interface{}{
		"uid":         model.Uid,
		"username":    model.Username,
		"password":    model.Password,
		"nickname":    model.Nickname,
		"email":       model.EMail,
		"website":     model.Website,
		"photo":       model.Photo,
		"fingerprint": model.Fingerprint,
	}

	_, err := datastore.NamedExec(sqlText, sqlParams)
	if err != nil {
		return fmt.Errorf("EnsureAccount: %w", err)
	}
	return nil
}
