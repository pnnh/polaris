package files

import (
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/pnnh/neutron/helpers"
	"github.com/pnnh/neutron/services/datastore"
	"github.com/sirupsen/logrus"
)

type FileSelectParams struct {
	Parent  string
	Channel string
	SkipDir bool
}

func SelectFiles(keyword string, page int, size int, params *FileSelectParams) (*helpers.Pagination,
	[]*datastore.DataRow, error) {
	pagination := helpers.CalcPaginationByPage(page, size)
	baseSqlText := ` select * from community.files `
	baseSqlParams := map[string]interface{}{}

	whereText := ` where status = 1 `
	if params != nil && params.Parent != "" {
		whereText += ` and parent = :parent `
		baseSqlParams["parent"] = params.Parent
	}
	if params != nil && params.Channel != "" {
		whereText += ` and channel = :channel `
		baseSqlParams["channel"] = params.Channel
	}
	if params != nil && params.SkipDir {
		whereText += ` and mimetype <> 'directory' and mimetype <> 'folder' `
	}
	if keyword != "" {
		whereText += ` and (title ilike :keyword or description ilike :keyword) `
		baseSqlParams["keyword"] = "%" + keyword + "%"
	}
	orderText := ` order by create_time desc `

	pageSqlText := fmt.Sprintf("%s %s %s %s", baseSqlText, whereText, orderText, ` offset :offset limit :limit; `)
	pageSqlParams := map[string]interface{}{
		"offset": pagination.Offset, "limit": pagination.Limit,
	}
	for k, v := range baseSqlParams {
		pageSqlParams[k] = v
	}
	var sqlResults = make([]*datastore.DataRow, 0)

	rows, err := datastore.NamedQuery(pageSqlText, pageSqlParams)
	if err != nil {
		return nil, nil, fmt.Errorf("NamedQuery: %w", err)
	}

	defer func() {
		if closeErr := rows.Close(); closeErr != nil {
			logrus.Warnf("rows.Close: %v", closeErr)
		}
	}()

	for rows.Next() {
		rowMap := make(map[string]interface{})
		if err := rows.MapScan(rowMap); err != nil {
			return nil, nil, fmt.Errorf("MapScan: %w", err)
		}
		tableMap := datastore.MapToDataRow(rowMap)
		sqlResults = append(sqlResults, tableMap)
	}
	if err := rows.Err(); err != nil {
		return nil, nil, fmt.Errorf("rows error: %w", err)
	}

	countSqlText := `select count(1) as count from (` +
		fmt.Sprintf("%s %s", baseSqlText, whereText) + `) as temp;`

	countSqlParams := map[string]interface{}{}
	for k, v := range baseSqlParams {
		countSqlParams[k] = v
	}
	var countSqlResults []struct {
		Count int `db:"count"`
	}

	rows, err = datastore.NamedQuery(countSqlText, countSqlParams)
	if err != nil {
		return nil, nil, fmt.Errorf("NamedQuery: %w", err)
	}
	if err = sqlx.StructScan(rows, &countSqlResults); err != nil {
		return nil, nil, fmt.Errorf("StructScan: %w", err)
	}
	if len(countSqlResults) == 0 {
		return nil, nil, fmt.Errorf("查询笔记总数有误，数据为空")
	}
	pagination.Count = countSqlResults[0].Count
	defer func() {
		if closeErr := rows.Close(); closeErr != nil {
			logrus.Warnf("rows.Close2: %v", closeErr)
		}
	}()

	return pagination, sqlResults, nil
}

func SelectFilePath(uid string) ([]*datastore.DataRow, error) {
	baseSqlText := ` SELECT ancestors.uid, ancestors.title, ancestors.name
FROM community.files AS target,
     community.files AS ancestors
WHERE target.uid = :uid
  AND ancestors.path @> target.path
ORDER BY nlevel(ancestors.path); `
	baseSqlParams := map[string]interface{}{
		"uid": uid,
	}

	var sqlResults = make([]*datastore.DataRow, 0)

	rows, err := datastore.NamedQuery(baseSqlText, baseSqlParams)
	if err != nil {
		return nil, fmt.Errorf("NamedQuery: %w", err)
	}

	defer func() {
		if closeErr := rows.Close(); closeErr != nil {
			logrus.Warnf("rows.Close: %v", closeErr)
		}
	}()

	for rows.Next() {
		rowMap := make(map[string]interface{})
		if err := rows.MapScan(rowMap); err != nil {
			return nil, fmt.Errorf("MapScan: %w", err)
		}
		tableMap := datastore.MapToDataRow(rowMap)
		sqlResults = append(sqlResults, tableMap)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}

	defer func() {
		if closeErr := rows.Close(); closeErr != nil {
			logrus.Warnf("rows.Close2: %v", closeErr)
		}
	}()

	return sqlResults, nil
}

func PGGetFile(owner, uid string) (*datastore.DataRow, error) {
	if uid == "" {
		return nil, fmt.Errorf("PGConsoleGetNote uid is empty")
	}

	pageSqlParams := map[string]interface{}{
		"owner": owner,
	}
	var pageSqlText string

	pageSqlText = ` select * from community.files where owner = :owner and uid = :uid; `
	pageSqlParams["uid"] = uid

	rows, err := datastore.NamedQuery(pageSqlText, pageSqlParams)
	if err != nil {
		return nil, fmt.Errorf("NamedQuery: %w", err)
	}

	defer func() {
		if closeErr := rows.Close(); closeErr != nil {
			logrus.Warnf("rows.Close: %v", closeErr)
		}
	}()

	for rows.Next() {
		rowMap := make(map[string]interface{})
		if err := rows.MapScan(rowMap); err != nil {
			return nil, fmt.Errorf("MapScan: %w", err)
		}
		tableMap := datastore.MapToDataRow(rowMap)
		if tableMap.Err != nil {
			return nil, fmt.Errorf("MapScan2: %w", tableMap.Err)
		}
		return tableMap, nil
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}
	return nil, nil
}
