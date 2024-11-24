package datastore

import (
	"fmt"
	"github.com/jmoiron/sqlx"
)

type ModelCondition struct {
	//table       *Table[T, M]
	Name        string
	Type        string
	DbColumn    string
	DbType      string
	DbCondition string
	DbOperator  string
	Changed     bool
	Value       any
}

func (m *ModelCondition) Eq(value any) *ModelCondition {
	m.DbCondition = "and"
	m.DbOperator = "="
	m.Changed = true
	m.Value = value
	return m
}

func TypeToDbType(fieldType string) string {
	switch fieldType {
	case "string":
		return "varchar"
	case "int":
		return "int"
	case "int64":
		return "bigint"
	case "float64":
		return "double"
	case "bool":
		return "boolean"
	default:
		return "varchar"
	}
}

type ITable[M any] interface {
	//NewModels() []*M
	GetConditions() []ModelCondition
}

type Table[T ITable[M], M any] struct {
	TableName string
	table     T
	//conditions []ModelCondition
}

func NewTable[T ITable[M], M any](name string, schema T) Table[T, M] {
	//modelType := reflect.TypeOf(model)
	//tableName := ""
	//if modelType.Kind() != reflect.Ptr {
	//	tableName = modelType.Name()
	//} else {
	//	tableName = modelType.Elem().Name()
	//}
	table := Table[T, M]{
		TableName: name,
		//conditions: make([]ModelCondition, 0),
		table: schema,
	}
	return table
}

func (m *Table[T, M]) SetTable(table T) {
	m.table = table
}

func NewCondition(goName, goType, dbColumn, dbType string) ModelCondition {
	cond := &ModelCondition{
		Name:     goName,
		Type:     goType,
		DbColumn: dbColumn,
		DbType:   dbType,
	}
	//m.conditions = append(m.conditions, cond)
	return *cond
}

func (m *Table[T, M]) GetWhereConditions() []ModelCondition {
	conditions := m.table.GetConditions()
	for _, v := range conditions {
		if v.Changed {
			conditions = append(conditions, v)
		}
	}
	return conditions
}

func (m *Table[T, M]) GetWhereParams() map[string]any {
	params := make(map[string]any, 0)
	conditions := m.table.GetConditions()
	for _, v := range conditions {
		if v.Changed {
			params[v.DbColumn] = v.Value
		}
	}
	return params
}

func (t *Table[T, M]) Get(pk any) (*M, error) {
	sqlText := fmt.Sprintf(`select * from %s where pk = :pk;`, t.TableName)

	sqlParams := map[string]interface{}{"pk": pk}
	//var sqlResults []*T
	//sqlResults := t.table.NewModels()
	sqlResults := make([]*M, 0)

	rows, err := NamedQuery(sqlText, sqlParams)
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

func (t *Table[T, M]) GetWhere(whereFunc func(m T)) (*M, error) {
	sqlText := fmt.Sprintf(`select * from %s`, t.TableName)

	//where := t //NewTable[T, M](t.TableName)
	//whereFunc(where.table)
	where := new(T)
	whereFunc(*where)

	whereText := ""
	conditions := t.GetWhereConditions()
	for _, v := range conditions {
		if v.Changed {
			whereText += fmt.Sprintf(`%s %s %s :%s`, v.DbCondition,
				v.DbColumn,
				v.DbOperator,
				v.DbColumn)
		}
	}
	if whereText != "" {
		firstCond := conditions[0].DbCondition
		prefix := whereText[len(firstCond):]
		sqlText += fmt.Sprintf(` where %s`, prefix)
	}
	whereParams := t.GetWhereParams()

	//var sqlResults []*RoleModel
	//sqlResults := t.table.NewModels()
	sqlResults := make([]*M, 0)

	rows, err := NamedQuery(sqlText, whereParams)
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

func (t *Table[T, M]) Select(offset, limit int) ([]M, error) {

	sqlText := fmt.Sprintf(`select * from %s offset :offset limit :limit;`,
		t.TableName)

	sqlParams := map[string]interface{}{"offset": offset, "limit": limit}
	var sqlResults []M

	rows, err := NamedQuery(sqlText, sqlParams)
	if err != nil {
		return nil, fmt.Errorf("NamedQuery: %w", err)
	}
	if err = sqlx.StructScan(rows, &sqlResults); err != nil {
		return nil, fmt.Errorf("StructScan: %w", err)
	}

	return sqlResults, nil
}

func (t *Table[T, M]) Count() (int64, error) {
	sqlText := fmt.Sprintf(`select count(1) as count from %s;`, t.TableName)

	sqlParams := map[string]interface{}{}
	var sqlResults []struct {
		Count int64 `db:"count"`
	}

	rows, err := NamedQuery(sqlText, sqlParams)
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
