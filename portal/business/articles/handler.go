package articles

import (
	"net/http"
	"strconv"

	nemodels "github.com/pnnh/neutron/models"
	"github.com/pnnh/neutron/services/datastore"
	"github.com/pnnh/neutron/services/datetime"

	"github.com/gin-gonic/gin"
)

func noteGetOutView(dataRow *datastore.DataRow) (map[string]interface{}, error) {
	outView := make(map[string]interface{})
	outView["uid"] = dataRow.GetString("uid")
	outView["title"] = dataRow.GetString("title")
	outView["header"] = dataRow.GetString("header")
	outView["body"] = dataRow.GetString("body")
	outView["description"] = dataRow.GetStringOrEmpty("description")
	outView["keywords"] = dataRow.GetStringOrDefault("keywords", "")
	outView["status"] = dataRow.GetInt("status")
	outView["cover"] = dataRow.GetStringOrDefault("cover", "")
	outView["owner"] = dataRow.GetStringOrEmpty("owner")
	outView["channel"] = dataRow.GetStringOrDefault("channel", "")
	outView["discover"] = dataRow.GetInt("discover")
	outView["partition"] = dataRow.GetStringOrDefault("partition", "")
	outView["create_time"] = dataRow.GetTime("create_time")
	outView["update_time"] = dataRow.GetTime("update_time")
	outView["version"] = dataRow.GetStringOrDefault("version", "")
	outView["build"] = dataRow.GetStringOrDefault("build", "")
	outView["url"] = dataRow.GetStringOrDefault("url", "")
	outView["branch"] = dataRow.GetStringOrDefault("branch", "")
	outView["commit"] = dataRow.GetStringOrDefault("commit", "")
	outView["commit_time"] = dataRow.GetTimeOrDefault("commit_time", datetime.UtcMinTime)
	outView["relative_path"] = dataRow.GetStringOrDefault("relative_path", "")
	outView["repo_id"] = dataRow.GetStringOrDefault("repo_id", "")
	outView["lang"] = dataRow.GetStringOrDefault("lang", "")
	outView["name"] = dataRow.GetStringOrDefault("name", "")
	outView["checksum"] = dataRow.GetStringOrDefault("checksum", "")
	outView["syncno"] = dataRow.GetStringOrDefault("syncno", "")
	outView["repo_first_commit"] = dataRow.GetStringOrDefault("repo_first_commit", "")
	outView["mimetype"] = dataRow.GetStringOrDefault("mimetype", "")
	outView["content"] = dataRow.GetStringOrDefault("content", "")
	outView["styles"] = dataRow.GetStringOrDefault("styles", "")
	outView["convert_time"] = dataRow.GetTimeOrDefault("convert_time", datetime.UtcMinTime)

	return outView, nil
}

func NoteSelectHandler(gctx *gin.Context) {
	keyword := gctx.Query("keyword")
	page := gctx.Query("page")
	size := gctx.Query("size")
	channel := gctx.Query("channel")
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
	pagination, selectResult, err := PGSelectNotes(channel, keyword, pageInt, sizeInt, lang)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询笔记出错"))
		return
	}

	respView := make([]map[string]interface{}, 0)
	for _, v := range selectResult {
		outView, err := noteGetOutView(v)
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

func NoteGetHandler(gctx *gin.Context) {
	uid := gctx.Param("uid")
	lang := gctx.Query("lang")
	if uid == "" {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("uid不能为空"))
		return
	}
	noteRow, err := PGGetNote(uid, lang)
	if err != nil || noteRow == nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询笔记出错"))
		return
	}

	outView, err := noteGetOutView(noteRow)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithError(err))
		return
	}
	responseResult := nemodels.NECodeOk.WithLocalData(lang, outView)

	gctx.JSON(http.StatusOK, responseResult)
}
