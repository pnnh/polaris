package libraries

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/pnnh/neutron/helpers"
	nemodels "github.com/pnnh/neutron/models"
	"github.com/pnnh/neutron/services/datastore"
	"portal/business"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/sirupsen/logrus"
)

func ConsoleLibrarySelectHandler(gctx *gin.Context) {
	keyword := gctx.Query("keyword")
	page := gctx.Query("page")
	size := gctx.Query("size")
	lang := gctx.Query("lang")
	pageInt, err := strconv.Atoi(page)
	if err != nil {
		pageInt = 1
	}
	sizeInt, err := strconv.Atoi(size)
	if err != nil {
		sizeInt = 100
	}

	accountModel, err := business.FindAccountFromCookie(gctx)
	if err != nil {
		logrus.Warnln("ConsoleChannelsSelectHandler", err)
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询账号出错b"))
		return
	}
	if accountModel == nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("账号不存在"))
		return
	}
	pagination, selectResult, err := ConsoleSelectChannels(accountModel.Uid, keyword, pageInt, sizeInt, lang)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询频道出错"))
		return
	}

	respView := make([]map[string]interface{}, 0)
	for _, v := range selectResult {
		outView, err := libraryGetOutView(v)
		if err != nil {
			gctx.JSON(http.StatusOK, nemodels.NECodeError.WithError(err))
			return
		}
		respView = append(respView, outView)
	}
	resp := map[string]any{
		"page":  pagination.Page,
		"size":  pagination.Size,
		"count": pagination.Count,
		"range": respView,
	}

	responseResult := nemodels.NECodeOk.WithData(resp)

	gctx.JSON(http.StatusOK, responseResult)
}

func libraryGetOutView(dataRow *datastore.DataRow) (map[string]interface{}, error) {
	outView := make(map[string]interface{})
	outView["uid"] = dataRow.GetString("uid")
	outView["name"] = dataRow.GetString("name")
	outView["description"] = dataRow.GetStringOrEmpty("description")
	outView["image"] = dataRow.GetStringOrDefault("image", "")
	outView["status"] = dataRow.GetInt("status")
	outView["create_time"] = dataRow.GetTime("create_time")
	outView["update_time"] = dataRow.GetTime("update_time")
	outView["lang"] = dataRow.GetStringOrDefault("lang", "")
	outView["owner"] = dataRow.GetStringOrEmpty("owner")
	outView["title"] = dataRow.GetStringOrEmpty("title")
	outView["header"] = dataRow.GetStringOrDefault("header", "")
	return outView, nil
}
func ConsoleSelectChannels(owner, keyword string, page int, size int, lang string) (*helpers.Pagination,
	[]*datastore.DataRow, error) {
	pagination := helpers.CalcPaginationByPage(page, size)
	baseSqlText := ` select * from personal.libraries `
	baseSqlParams := map[string]interface{}{}

	whereText := ` where owner = :owner `
	baseSqlParams["owner"] = owner
	if keyword != "" {
		whereText += ` and (name like :keyword or description like :keyword) `
		baseSqlParams["keyword"] = "%" + keyword + "%"
	}
	if lang != "" {
		whereText += ` and lang = :lang `
		baseSqlParams["lang"] = lang
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
		return nil, nil, fmt.Errorf("查询频道总数有误，数据为空")
	}

	pagination.Count = countSqlResults[0].Count
	return pagination, sqlResults, nil
}
