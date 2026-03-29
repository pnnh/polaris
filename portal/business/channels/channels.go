package channels

import (
	"fmt"
	"time"

	"github.com/pnnh/neutron/helpers"
	"github.com/pnnh/neutron/services/datastore"

	"github.com/jmoiron/sqlx"
	"github.com/sirupsen/logrus"
)

func PGChanGetByUid(uid string) (*datastore.DataRow, error) {
	getMap, err := datastore.NewGetQuery("community.channels",
		"status = 1 and uid = :uid", "", "",
		map[string]any{"uid": uid})
	if err != nil {
		return nil, fmt.Errorf("NewGetQuery: %w", err)
	}
	return getMap, nil
}

type MTChannelModel struct {
	Error       error     `json:"-" db:"-"`
	Uid         string    `json:"uid"`
	Name        string    `json:"name"`
	Status      int       `json:"status"`
	CreateTime  time.Time `json:"create_time" db:"create_time"`
	UpdateTime  time.Time `json:"update_time" db:"update_time"`
	Owner       string    `json:"owner" db:"owner"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Image       string    `json:"image"`
	Lang        string    `json:"lang"`
}

func SelectChannels(keyword string, page int, size int, lang string) (*helpers.Pagination,
	[]*datastore.DataRow, error) {
	pagination := helpers.CalcPaginationByPage(page, size)
	baseSqlText := ` select * from community.channels `
	baseSqlParams := map[string]interface{}{}

	whereText := ` where status = 1 `
	if keyword != "" {
		whereText += ` and (name like :keyword or description like :keyword) `
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
	defer func() {
		if closeErr := rows.Close(); closeErr != nil {
			logrus.Warnf("rows.Close2: %v", closeErr)
		}
	}()

	pagination.Count = countSqlResults[0].Count

	return pagination, sqlResults, nil
}

// 输入频道时自动完成
func PGCompleteChannels(keyword string, lang string) ([]*datastore.DataRow, error) {
	if keyword == "" {
		return nil, fmt.Errorf("keyword cannot be empty")
	}
	baseSqlText := ` select * from community.channels `
	baseSqlParams := map[string]interface{}{}

	whereText := ` where status = 1 `
	exactMatch := false
	if helpers.IsUuid(keyword) {
		exactMatch = true
		whereText += ` and uid = :keyword `
		baseSqlParams["lang"] = lang
		baseSqlParams["keyword"] = keyword
	} else {
		whereText += ` and (name ilike :keyword or description ilike :keyword) `
		baseSqlParams["keyword"] = "%" + keyword + "%"
	}
	orderText := ` order by create_time desc `

	pageSqlText := fmt.Sprintf("%s %s %s %s", baseSqlText, whereText, orderText, ` limit :limit; `)
	limitSize := 10 // 限制返回10条数据
	pageSqlParams := map[string]interface{}{
		"limit": limitSize,
	}
	for k, v := range baseSqlParams {
		pageSqlParams[k] = v
	}

	var sqlResults = make([]*datastore.DataRow, 0)

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
		if exactMatch {
			tableMap.SetString("match", "exact")
		}
		sqlResults = append(sqlResults, tableMap)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}

	return sqlResults, nil
}
