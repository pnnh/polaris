package models

import (
	"multiverse-authorization/neutron/services/datastore"
)

type PermissionSchema struct {
	Pk          datastore.ModelCondition
	Name        datastore.ModelCondition
	CreateTime  datastore.ModelCondition
	UpdateTime  datastore.ModelCondition
	Description datastore.ModelCondition
}

func NewPermissionSchema() PermissionSchema {
	where := PermissionSchema{
		Pk:          datastore.NewCondition("Pk", "string", "pk", "varchar"),
		Name:        datastore.NewCondition("Name", "string", "name", "varchar"),
		CreateTime:  datastore.NewCondition("CreateTime", "time", "create_time", "varchar"),
		UpdateTime:  datastore.NewCondition("UpdateTime", "time", "update_time", "varchar"),
		Description: datastore.NewCondition("Description", "string", "description", "varchar"),
	}
	return where
}

func (r PermissionSchema) GetConditions() []datastore.ModelCondition {
	return []datastore.ModelCondition{
		r.Pk,
		r.Name,
		r.CreateTime,
		r.UpdateTime,
		r.Description,
	}
}

var PermissionDataSet = datastore.NewTable[PermissionSchema, PermissionModel]("permissions",
	NewPermissionSchema())
