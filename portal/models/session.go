package models

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/pnnh/neutron/services/datastore"
)

type SessionModel struct {
	Uid          string         `json:"uid"`
	Content      string         `json:"content"`
	CreateTime   time.Time      `json:"create_time" db:"create_time"`
	UpdateTime   time.Time      `json:"update_time" db:"update_time"`
	Username     string         `json:"username"`
	Type         string         `json:"type"`
	Code         string         `json:"code"`
	ClientId     string         `json:"client_id" db:"client_id"`
	ResponseType string         `json:"response_type" db:"response_type"`
	RedirectUri  string         `json:"redirect_uri" db:"redirect_uri"`
	Scope        string         `json:"scope"`
	State        string         `json:"state"`
	Nonce        string         `json:"nonce"`
	IdToken      string         `json:"id_token" db:"id_token"`
	JwtId        string         `json:"jwt_id" db:"jwt_id"`
	AccessToken  string         `json:"access_token" db:"access_token"`
	OpenId       string         `json:"open_id" db:"open_id"`
	CompanyId    string         `json:"company_id" db:"company_id"`
	Account      string         `json:"account"`
	Address      string         `json:"address"`
	Link         sql.NullString `json:"link" db:"link"`
	Client       sql.NullString `json:"client" db:"client"`
}

type SessionViewModel struct {
	Uid string `json:"uid"`
}

func PutSession(model *SessionModel) error {
	sqlText := `insert into sessions(uid, content, create_time, update_time, username, type, code,
		client_id, response_type, redirect_uri, scope, state, nonce, id_token, jwt_id, access_token, open_id, company_id, 
                     account, address, link, client) 
	values(:uid, :content, :create_time, :update_time, :username, :type, :code, :client_id, :response_type, :redirect_uri,
		:scope, :state, :nonce, :id_token, :jwt_id, :access_token, :open_id, :company_id, :account, :address, :link, :client)`

	sqlParams := map[string]interface{}{"uid": model.Uid, "content": model.Content, "create_time": model.CreateTime,
		"update_time": model.UpdateTime, "username": model.Username, "type": model.Type,
		"code": model.Code, "client_id": model.ClientId, "response_type": model.ResponseType,
		"redirect_uri": model.RedirectUri, "scope": model.Scope, "state": model.State,
		"nonce": model.Nonce, "id_token": model.IdToken, "jwt_id": model.JwtId,
		"access_token": model.AccessToken, "open_id": model.OpenId, "company_id": model.CompanyId,
		"account": model.Account, "address": model.Address, "link": model.Link, "client": model.Client}

	_, err := datastore.NamedExec(sqlText, sqlParams)
	if err != nil {
		return fmt.Errorf("PutSession: %w", err)
	}
	return nil
}

func GetSessionById(uid string) (*SessionModel, error) {
	sqlText := `select * from sessions where uid = :uid;`

	sqlParams := map[string]interface{}{"uid": uid}
	var sqlResults []*SessionModel

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

func GetSessionByLink(app, link string) (*SessionModel, error) {
	sqlText := `select * from sessions where client = :client and link = :link;`

	sqlParams := map[string]interface{}{
		"link":   link,
		"client": app,
	}
	var sqlResults []*SessionModel

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

// 根据访问用户的地址信息获取匿名会话信息
func GetSessionByAddress(address string) (*SessionModel, error) {
	sqlText := `select * from sessions where address = :address and update_time > :nowDay;`

	nowYear, nowMonth, nowDay := time.Now().AddDate(0, 0, -1).Date()
	sqlParams := map[string]interface{}{"address": address, "nowDay": time.Date(nowYear, nowMonth, nowDay, 0, 0, 0, 0, time.UTC)}
	var sqlResults []*SessionModel

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

func FindSessionByJwtId(clientId, username, jwtId string) (*SessionModel, error) {

	sqlText := `select * from sessions where client_id = :client_id and username = :username and jwt_id = :jwt_id;`

	sqlParams := map[string]interface{}{
		"client_id": clientId,
		"username":  username,
		"jwt_id":    jwtId,
	}
	var sqlResults []*SessionModel

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

func FindSessionByAccessToken(clientId, accessToken string) (*SessionModel, error) {
	sqlText := `select * from sessions where client_id = :client_id and access_token = :access_token;`

	sqlParams := map[string]interface{}{
		"client_id":    clientId,
		"access_token": accessToken,
	}
	var sqlResults []*SessionModel

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

func FindSessionByCode(clientId, code string) (*SessionModel, error) {
	sqlText := `select * from sessions where client_id = :client_id and code = :code;`

	sqlParams := map[string]interface{}{
		"client_id": clientId,
		"code":      code,
	}
	var sqlResults []*SessionModel

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

func UpdateSessionToken(id string, accessToken, idToken, jwtId string) error {
	sqlText := `update sessions set id_token=:id_token, access_token=:access_token, jwt_id=:jwt_id, 
		update_time=:update_time
	where pk = :uid;`

	sqlParams := map[string]interface{}{
		"update_time":  time.Now(),
		"access_token": accessToken,
		"jwt_id":       jwtId,
		"uid":          id,
		"id_token":     idToken,
	}

	_, err := datastore.NamedExec(sqlText, sqlParams)
	if err != nil {
		return fmt.Errorf("UpdateAccountPassword: %w", err)
	}
	return nil

}
