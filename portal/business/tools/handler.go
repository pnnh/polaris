package tools

import (
	"net/http"
	"strconv"

	nemodels "github.com/pnnh/neutron/models"
	"github.com/pnnh/neutron/services/datastore"

	"github.com/gin-gonic/gin"
)

func toolGetOutView(dataRow *datastore.DataRow) (map[string]interface{}, error) {
	outView := make(map[string]interface{})
	outView["uid"] = dataRow.GetString("uid")
	outView["title"] = dataRow.GetStringOrDefault("title", "")
	outView["name"] = dataRow.GetStringOrDefault("name", "")
	outView["keywords"] = dataRow.GetStringOrDefault("keywords", "")
	outView["description"] = dataRow.GetStringOrDefault("description", "")
	outView["status"] = dataRow.GetInt("status")
	outView["cover"] = dataRow.GetStringOrDefault("cover", "")
	outView["owner"] = dataRow.GetStringOrEmpty("owner")
	outView["discover"] = dataRow.GetInt("discover")
	outView["version"] = dataRow.GetStringOrDefault("version", "")
	outView["url"] = dataRow.GetStringOrDefault("url", "")
	outView["lang"] = dataRow.GetStringOrDefault("lang", "")
	outView["create_time"] = dataRow.GetTime("create_time")
	outView["update_time"] = dataRow.GetTime("update_time")

	return outView, nil
}

func ToolSelectHandler(gctx *gin.Context) {
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
		sizeInt = 10
	}
	if lang == "" {
		lang = nemodels.DefaultLanguage
	}

	pagination, selectResult, err := SelectTools(keyword, pageInt, sizeInt, lang)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询工具出错"))
		return
	}

	respView := make([]map[string]interface{}, 0)
	for _, v := range selectResult {
		outView, err := toolGetOutView(v)
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

	gctx.JSON(http.StatusOK, nemodels.NECodeOk.WithData(resp))
}
