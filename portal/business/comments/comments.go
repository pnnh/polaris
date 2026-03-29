package comments

import (
	"fmt"
	nemodels "github.com/pnnh/neutron/models"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/pnnh/neutron/helpers"
	"github.com/pnnh/neutron/services/datastore"
)

const CommentViewersRedisKey = "comment:viewers"

type CommentModel struct {
	Uid         string    `json:"uid"`     // 主键标识
	Content     string    `json:"content"` // 内容
	CreateTime  time.Time `json:"create_time" db:"create_time"`
	UpdateTime  time.Time `json:"update_time" db:"update_time"`
	Creator     string    `json:"creator"`
	Thread      string    `json:"thread"`
	Referer     string    `json:"referer"`
	Resource    string    `json:"resource"`
	IPAddress   string    `json:"ip_address"`
	Status      int       `json:"status"`
	Fingerprint string    `json:"fingerprint"`
	EMail       string    `json:"email"`
	Nickname    string    `json:"nickname"`
	Website     string    `json:"website"`
	Discover    int       `json:"discover"`
}

func PGInsertComment(model *CommentModel) error {
	sqlText := `insert into comments(uid, content, create_time, update_time, creator, thread, referer, 
        resource, ipaddress, fingerprint, email, nickname, website, status)
values(:uid, :content, now(), now(), :creator, :thread, :referer, :resource, :ipaddress, :fingerprint, 
       :email, :nickname, :website, 0)
on conflict (uid)
do update set content = excluded.content, update_time = now();`

	sqlParams := map[string]interface{}{
		"uid":         model.Uid,
		"content":     model.Content,
		"creator":     model.Creator,
		"thread":      model.Thread,
		"referer":     model.Referer,
		"resource":    model.Resource,
		"ipaddress":   model.IPAddress,
		"fingerprint": model.Fingerprint,
		"email":       model.EMail,
		"nickname":    model.Nickname,
		"website":     model.Website,
	}

	_, err := datastore.NamedExec(sqlText, sqlParams)
	if err != nil {
		return fmt.Errorf("PGInsertComment: %w", err)
	}
	return nil
}

func SelectComments(resource string, page int, size int) (*nemodels.NESelectResponse, error) {

	pagination := helpers.CalcPaginationByPage(page, size)
	baseSqlText := ` select * from comments where resource = :resource and (status = 1 or discover is null or discover <= 10) 
                        order by create_time desc `

	pageSqlText := baseSqlText + ` offset :offset limit :limit; `
	pageSqlParams := map[string]interface{}{
		"resource": resource,
		"offset":   pagination.Offset, "limit": pagination.Limit}
	var sqlResults []*CommentModel

	rows, err := datastore.NamedQuery(pageSqlText, pageSqlParams)
	if err != nil {
		return nil, fmt.Errorf("NamedQuery: %w", err)
	}
	if err = sqlx.StructScan(rows, &sqlResults); err != nil {
		return nil, fmt.Errorf("StructScan: %w", err)
	}

	resultRange := make([]any, 0)
	for _, item := range sqlResults {
		resultRange = append(resultRange, item)
	}

	countSqlText := `select count(1) as count from (` + baseSqlText + `) as temp;`

	countSqlParams := map[string]interface{}{"resource": resource}
	var countSqlResults []struct {
		Count int `db:"count"`
	}

	rows, err = datastore.NamedQuery(countSqlText, countSqlParams)
	if err != nil {
		return nil, fmt.Errorf("NamedQuery: %w", err)
	}
	if err = sqlx.StructScan(rows, &countSqlResults); err != nil {
		return nil, fmt.Errorf("StructScan: %w", err)
	}
	if len(countSqlResults) == 0 {
		return nil, fmt.Errorf("查询评论总数有误，数据为空")
	}

	selectData := &nemodels.NESelectResponse{
		Page:  pagination.Page,
		Size:  pagination.Size,
		Count: countSqlResults[0].Count,
		Range: resultRange,
	}

	return selectData, nil
}
