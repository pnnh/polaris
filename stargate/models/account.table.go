package models

import (
	"multiverse-authorization/neutron/services/datastore"
)

type AccountSchema struct {
	Pk          datastore.ModelCondition
	Username    datastore.ModelCondition
	Password    datastore.ModelCondition
	Photo       datastore.ModelCondition
	CreateTime  datastore.ModelCondition
	UpdateTime  datastore.ModelCondition
	Nickname    datastore.ModelCondition
	Mail        datastore.ModelCondition
	Credentials datastore.ModelCondition
	Session     datastore.ModelCondition
	Description datastore.ModelCondition
	Status      datastore.ModelCondition
}

func NewAccountSchema() AccountSchema {
	where := AccountSchema{
		Pk:          datastore.NewCondition("Pk", "string", "pk", "varchar"),
		Username:    datastore.NewCondition("Username", "string", "username", "varchar"),
		Password:    datastore.NewCondition("Password", "string", "password", "varchar"),
		Photo:       datastore.NewCondition("Photo", "string", "photo", "varchar"),
		CreateTime:  datastore.NewCondition("CreateTime", "time", "create_time", "varchar"),
		UpdateTime:  datastore.NewCondition("UpdateTime", "time", "update_time", "varchar"),
		Nickname:    datastore.NewCondition("Nickname", "string", "nickname", "varchar"),
		Mail:        datastore.NewCondition("Mail", "string", "mail", "varchar"),
		Credentials: datastore.NewCondition("Credentials", "string", "credentials", "varchar"),
		Session:     datastore.NewCondition("Session", "string", "session", "varchar"),
		Description: datastore.NewCondition("Description", "string", "description", "varchar"),
		Status:      datastore.NewCondition("Status", "int", "status", "int"),
	}
	return where
}

func (r AccountSchema) GetConditions() []datastore.ModelCondition {
	return []datastore.ModelCondition{
		r.Pk,
		r.Username,
		r.Password,
		r.Photo,
		r.CreateTime,
		r.UpdateTime,
		r.Nickname,
		r.Mail,
		r.Credentials,
		r.Session,
		r.Description,
		r.Status,
	}
}

var AccountDataSet = datastore.NewTable[AccountSchema, AccountModel]("accounts",
	NewAccountSchema())
