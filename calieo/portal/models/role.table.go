package models

import (
	"multiverse-authorization/neutron/services/datastore"
)

type RoleSchema struct {
	Pk          datastore.ModelCondition
	Name        datastore.ModelCondition
	CreateTime  datastore.ModelCondition
	UpdateTime  datastore.ModelCondition
	Description datastore.ModelCondition
}

func NewRoleSchema() RoleSchema {
	where := RoleSchema{
		Pk:          datastore.NewCondition("Pk", "string", "pk", "varchar"),
		Name:        datastore.NewCondition("Name", "string", "name", "varchar"),
		CreateTime:  datastore.NewCondition("CreateTime", "time", "create_time", "varchar"),
		UpdateTime:  datastore.NewCondition("UpdateTime", "time", "update_time", "varchar"),
		Description: datastore.NewCondition("Description", "string", "description", "varchar"),
	}
	return where
}

func (r RoleSchema) GetConditions() []datastore.ModelCondition {
	return []datastore.ModelCondition{
		r.Pk,
		r.Name,
		r.CreateTime,
		r.UpdateTime,
		r.Description,
	}
}

var RoleDataSet = datastore.NewTable[RoleSchema, RoleModel]("roles",
	NewRoleSchema())
