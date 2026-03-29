package images

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/pnnh/neutron/config"
	nemodels "github.com/pnnh/neutron/models"
	"github.com/pnnh/neutron/services/datastore"
	"github.com/sirupsen/logrus"

	"github.com/gin-gonic/gin"
)

func imageGetOutView(storageUrl string, dataRow *datastore.DataRow) (map[string]interface{}, error) {
	outView := make(map[string]interface{})
	outView["uid"] = dataRow.GetString("uid")
	outView["title"] = dataRow.GetStringOrEmpty("title")
	outView["create_time"] = dataRow.GetTime("create_time")
	outView["update_time"] = dataRow.GetTime("update_time")
	outView["keywords"] = dataRow.GetStringOrEmpty("keywords")
	outView["description"] = dataRow.GetStringOrEmpty("description")
	outView["status"] = dataRow.GetInt("status")
	outView["owner"] = dataRow.GetStringOrEmpty("owner")
	outView["channel"] = dataRow.GetStringOrDefault("channel", "")
	outView["file_path"] = dataRow.GetStringOrDefault("file_path", "")
	outView["ext_name"] = dataRow.GetStringOrDefault("ext_name", "")
	fileUrl := dataRow.GetStringOrDefault("url", "")
	outView["url"] = strings.Replace(fileUrl, "storage://", storageUrl, 1)

	return outView, nil
}

func ImageSelectHandler(gctx *gin.Context) {
	keyword := gctx.Query("keyword")
	page := gctx.Query("page")
	size := gctx.Query("size")
	pageInt, err := strconv.Atoi(page)
	if err != nil {
		pageInt = 1
	}
	sizeInt, err := strconv.Atoi(size)
	if err != nil {
		sizeInt = 20
	}
	pagination, selectResult, err := SelectImages(keyword, pageInt, sizeInt)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询图片出错"))
		return
	}

	portalUrl, ok := config.GetConfigurationString("PUBLIC_PORTAL_URL")
	if !ok || portalUrl == "" {
		logrus.Warnln("PUBLIC_PORTAL_URL 未配置2")
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "PUBLIC_PORTAL_URL 未配置3"))
		return
	}
	storageUrl := portalUrl + "/storage/"
	respView := make([]map[string]interface{}, 0)
	for _, v := range selectResult {
		outView, err := imageGetOutView(storageUrl, v)
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

func ImageGetHandler(gctx *gin.Context) {
	uid := gctx.Param("uid")
	if uid == "" {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("uid不能为空"))
		return
	}
	selectResult, err := PGGetImage(uid)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询图片出错"))
		return
	}
	if selectResult == nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("图片不存在"))
		return
	}

	portalUrl, ok := config.GetConfigurationString("PUBLIC_PORTAL_URL")
	if !ok || portalUrl == "" {
		logrus.Warnln("PUBLIC_PORTAL_URL 未配置2")
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "PUBLIC_PORTAL_URL 未配置3"))
		return
	}
	storageUrl := portalUrl + "/storage/"
	outView, err := imageGetOutView(storageUrl, selectResult)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithError(err))
		return
	}

	responseResult := nemodels.NECodeOk.WithData(outView)

	gctx.JSON(http.StatusOK, responseResult)
}
