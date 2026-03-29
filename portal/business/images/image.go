package images

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/pnnh/neutron/helpers"
	"github.com/pnnh/neutron/services/datastore"
	"github.com/sirupsen/logrus"

	"github.com/jmoiron/sqlx"
)

type MTImageModel struct {
	Uid         string         `json:"uid"`
	Title       string         `json:"title"`
	Description sql.NullString `json:"-"`
	Keywords    string         `json:"keywords"`
	Status      int            `json:"status"`
	Owner       sql.NullString `json:"-"`
	Channel     sql.NullString `json:"-"`
	Discover    int            `json:"discover"`
	CreateTime  time.Time      `json:"create_time" db:"create_time"`
	UpdateTime  time.Time      `json:"update_time" db:"update_time"`
	FilePath    sql.NullString `json:"-" db:"file_path"`
	ExtName     sql.NullString `json:"-" db:"ext_name"`
	Checksum    sql.NullString `json:"-" db:"checksum"`
}

func (m MTImageModel) ToViewModel() interface{} {
	view := &MTImageView{
		MTImageModel: m,
	}
	if m.Description.Valid {
		view.Description = m.Description.String
	}
	if m.ExtName.Valid {
		view.ExtName = m.ExtName.String
	}
	if m.FilePath.Valid {
		view.FilePath = m.FilePath.String
	}
	if m.Checksum.Valid {
		view.Checksum = m.Checksum.String
	}
	return view
}

type MTImageView struct {
	MTImageModel
	Description string `json:"description"`
	FilePath    string `json:"file_path"`
	ExtName     string `json:"ext_name"`
	Checksum    string `json:"checksum"`
}

func PGInsertImage(model *MTImageModel) error {
	sqlText := `insert into community.files(uid, title, keywords, description, create_time, update_time, channel, status, 
                   discover, owner, file_path, ext_name, checksum)
values(:uid, :title, :keywords, :description, now(), now(), :channel, :status, :discover, :owner, :file_path, :ext_name, :checksum)
on conflict (checksum)
do nothing;`

	sqlParams := map[string]interface{}{
		"uid":         model.Uid,
		"title":       model.Title,
		"description": model.Description,
		"keywords":    model.Keywords,
		"channel":     model.Channel,
		"status":      model.Status,
		"discover":    model.Discover,
		"owner":       model.Owner,
		"file_path":   model.FilePath,
		"ext_name":    model.ExtName,
		"checksum":    model.Checksum,
	}

	_, err := datastore.NamedExec(sqlText, sqlParams)
	if err != nil {
		return fmt.Errorf("PGInsertImage: %w", err)
	}
	return nil
}

func SelectImages(keyword string, page int, size int) (*helpers.Pagination,
	[]*datastore.DataRow, error) {
	pagination := helpers.CalcPaginationByPage(page, size)
	baseSqlText := ` select * from community.files `
	baseSqlParams := map[string]interface{}{}

	whereText := ` where status = 1 `
	if keyword != "" {
		whereText += ` and (title like :keyword or description like :keyword) `
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
	defer func() {
		if closeErr := rows.Close(); closeErr != nil {
			logrus.Warnf("rows.Close: %v", closeErr)
		}
	}()
	if err != nil {
		return nil, nil, fmt.Errorf("NamedQuery: %w", err)
	}
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
	countSqlText := fmt.Sprintf("select count(1) as count "+" from (%s) as temp;",
		fmt.Sprintf("%s %s", baseSqlText, whereText))

	countSqlParams := map[string]interface{}{}
	for k, v := range baseSqlParams {
		countSqlParams[k] = v
	}
	var countSqlResults []struct {
		Count int `db:"count"`
	}

	rows, err = datastore.NamedQuery(countSqlText, countSqlParams)
	defer func() {
		if closeErr := rows.Close(); closeErr != nil {
			logrus.Warnf("rows.Close: %v", closeErr)
		}
	}()
	if err != nil {
		return nil, nil, fmt.Errorf("NamedQuery: %w", err)
	}
	if err = sqlx.StructScan(rows, &countSqlResults); err != nil {
		return nil, nil, fmt.Errorf("StructScan: %w", err)
	}
	if len(countSqlResults) == 0 {
		return nil, nil, fmt.Errorf("查询图片总数有误，数据为空")
	}

	pagination.Count = countSqlResults[0].Count
	return pagination, sqlResults, nil
}

func PGGetImage(uid string) (*datastore.DataRow, error) {

	pageSqlText := ` select f.*, m.* from community.files m, community.files f where m.status = 1 and f.status = 1 
                                          and m.uid = f.uid and m.uid = :uid; `
	pageSqlParams := map[string]interface{}{
		"uid": uid,
	}

	rows, err := datastore.NamedQuery(pageSqlText, pageSqlParams)
	defer func() {
		if closeErr := rows.Close(); closeErr != nil {
			logrus.Warnf("rows.Close: %v", closeErr)
		}
	}()
	if err != nil {
		return nil, fmt.Errorf("NamedQuery: %w", err)
	}
	for rows.Next() {
		rowMap := make(map[string]interface{})
		if err := rows.MapScan(rowMap); err != nil {
			return nil, fmt.Errorf("MapScan: %w", err)
		}
		tableMap := datastore.MapToDataRow(rowMap)
		return tableMap, nil
	}
	return nil, nil
}
