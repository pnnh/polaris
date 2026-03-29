package files

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"portal/models"

	"portal/business"

	"github.com/pnnh/neutron/config"
	"github.com/pnnh/neutron/helpers"
	"github.com/pnnh/neutron/helpers/jsonmap"
	nemodels "github.com/pnnh/neutron/models"
	"github.com/pnnh/neutron/services/datastore"
	"github.com/pnnh/neutron/services/datetime"
	"github.com/sirupsen/logrus"

	"github.com/gin-gonic/gin"
)

func fileGetOutView(storageUrl string, dataRow *datastore.DataRow) (map[string]interface{}, error) {
	outView := make(map[string]interface{})
	outView["uid"] = dataRow.GetString("uid")
	outView["title"] = dataRow.GetString("title")
	outView["header"] = dataRow.GetStringOrEmpty("header")
	outView["body"] = dataRow.GetStringOrEmpty("body")
	outView["description"] = dataRow.GetStringOrEmpty("description")
	outView["keywords"] = dataRow.GetStringOrDefault("keywords", "")
	outView["status"] = dataRow.GetInt("status")
	outView["cover"] = dataRow.GetStringOrDefault("cover", "")
	outView["owner"] = dataRow.GetNullString("owner")
	outView["discover"] = dataRow.GetInt("discover")
	outView["partition"] = dataRow.GetStringOrDefault("partition", "")
	outView["create_time"] = dataRow.GetTime("create_time")
	outView["update_time"] = dataRow.GetTime("update_time")
	outView["version"] = dataRow.GetStringOrDefault("version", "")
	outView["build"] = dataRow.GetStringOrDefault("build", "")
	fileUrl := dataRow.GetStringOrDefault("url", "")
	outView["url"] = strings.Replace(fileUrl, "storage://", storageUrl, 1)
	outView["branch"] = dataRow.GetStringOrDefault("branch", "")
	outView["commit"] = dataRow.GetStringOrDefault("commit", "")
	outView["name"] = dataRow.GetStringOrDefault("name", "")
	outView["checksum"] = dataRow.GetStringOrDefault("checksum", "")
	outView["syncno"] = dataRow.GetStringOrDefault("syncno", "")
	outView["channel_name"] = dataRow.GetStringOrDefault("channel_name", "")
	outView["mimetype"] = dataRow.GetStringOrDefault("mimetype", "")
	outView["object_uid"] = dataRow.GetStringOrDefault("object_uid", "")
	outView["channel"] = dataRow.GetStringOrDefault("channel", "")

	return outView, nil
}

// 在主机模式下遍历某个目录下的笔记列表
func CloudFileSelectHandler(gctx *gin.Context) {
	keyword := gctx.Query("keyword")
	page := gctx.Query("page")
	size := gctx.Query("size")
	parent := gctx.Query("parent")
	channel := gctx.Query("channel")
	skipDir := gctx.Query("skipDir")
	pageInt, err := strconv.Atoi(page)
	if err != nil {
		logrus.Warningln("pageInt warning", err)
		pageInt = 1
	}
	sizeInt, err := strconv.Atoi(size)
	if err != nil {
		sizeInt = 10
	}
	accountModel, err := business.FindAccountFromCookie(gctx)
	if err != nil {
		logrus.Warnln("ConsoleNotesSelectHandler", err)
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询账号出错b"))
		return
	}
	if accountModel == nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("账号不存在"))
		return
	}
	viewParam := gctx.Query("viewType")
	if viewParam != "filesystem" && viewParam != "library" {
		viewParam = "library"
	}
	selectParams := &FileSelectParams{
		Parent:  parent,
		Channel: channel,
	}
	if skipDir == "true" {
		selectParams.SkipDir = true
	}
	pagination, selectResult, err := SelectFiles(keyword, pageInt, sizeInt, selectParams)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询笔记出错2"))
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
		outView, err := fileGetOutView(storageUrl, v)
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

func CloudFilePathSelectHandler(gctx *gin.Context) {

	uid := gctx.Query("uid")
	accountModel, err := business.FindAccountFromCookie(gctx)
	if err != nil {
		logrus.Warnln("ConsoleNotesSelectHandler", err)
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询账号出错b"))
		return
	}
	if accountModel == nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("账号不存在"))
		return
	}
	selectResult, err := SelectFilePath(uid)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询笔记出错2"))
		return
	}

	respView := make([]map[string]interface{}, 0)
	for _, dataRow := range selectResult {
		outView := make(map[string]interface{})
		outView["uid"] = dataRow.GetString("uid")
		outView["title"] = dataRow.GetString("title")
		outView["name"] = dataRow.GetString("name")
		respView = append(respView, outView)
	}

	resp := map[string]any{
		"page":  1,
		"size":  len(selectResult),
		"count": len(selectResult),
		"range": respView,
	}

	responseResult := nemodels.NECodeOk.WithData(resp)

	gctx.JSON(http.StatusOK, responseResult)
}

func CloudFileDescHandler(gctx *gin.Context) {
	uid := gctx.Query("uid")
	if uid == "" {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(fmt.Errorf("dir参数不能为空"), "查询笔记出错"))
		return
	}
	accountModel, err := business.FindAccountFromCookie(gctx)
	if err != nil {
		logrus.Warnln("ConsoleNotesSelectHandler", err)
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询账号出错b"))
		return
	}
	if accountModel == nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("账号不存在"))
		return
	}
	dataRow, err := PGGetFile(accountModel.Uid, uid)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询笔记出错1"))
		return
	}

	responseResult := nemodels.NECodeOk.WithData(dataRow.InnerMap())

	gctx.JSON(http.StatusOK, responseResult)
}

// 根文件UID代表最顶级目录
const RootDirectoryUid = "76de121c-0fab-11f1-a643-6c02e0549f86"

func GetRootFileInfo() *datastore.DataRow {
	dataRow := datastore.NewDataRow()
	dataRow.SetString("uid", RootDirectoryUid)
	dataRow.SetString("title", "RootFile")
	dataRow.SetString("header", "{}")
	dataRow.SetString("body", "{}")
	dataRow.SetString("description", "")
	dataRow.SetString("keywords", "")
	dataRow.SetInt("status", 1)
	dataRow.SetNullString("cover", "")
	dataRow.SetString("owner", models.RootAccount.Uid)
	dataRow.SetNullString("channel", "")
	dataRow.SetInt("discover", 0)
	dataRow.SetNullString("partition", "")
	dataRow.SetTime("create_time", time.Unix(1772002019, 0))
	dataRow.SetTime("update_time", time.Unix(1772002019, 0))
	dataRow.SetNullString("version", "0")
	dataRow.SetString("lang", "")
	dataRow.SetNullString("parent", helpers.EmptyUuid())
	dataRow.SetNullString("name", "fileName")
	dataRow.SetNullString("checksum", "")
	dataRow.SetNullString("syncno", "")
	dataRow.SetNullString("mimetype", "directory")
	dataRow.SetString("url", "")
	dataRow.SetString("path", RootDirectoryUid)
	return dataRow
}

func CloudFileUpdateHandler(gctx *gin.Context) {
	uid := gctx.Param("uid")
	if uid == "" {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("uid不能为空"))
		return
	}

	jsonMap := jsonmap.NewJsonMap()

	if err := gctx.ShouldBind(jsonMap.InnerMapPtr()); err != nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithError(err))
		return
	}
	parent := jsonMap.WillGetString("parent")
	if parent == "" || !helpers.IsUuid(parent) {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("parent不能为空或格式错误"))
		return
	}
	accountModel, err := business.FindAccountFromCookie(gctx)
	if err != nil {
		logrus.Warnln("HandleInsert", err)
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询账号出错c"))
		return
	}
	if accountModel == nil || accountModel.IsAnonymous() {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("账号不存在或匿名用户不能发布笔记"))
		return
	}

	var parentPath string
	if parent == RootDirectoryUid {
		parentPath = GetRootFileInfo().GetString("path")
	} else {
		parentInfo, err := PGGetFile(accountModel.Uid, parent)
		if err != nil || parentInfo == nil {
			gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询父目录信息出错"))
			return
		}
		parentPath = parentInfo.GetString("path")
	}
	if parentPath == "" {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "父目录Path为空"))
		return
	}

	inTitle := jsonMap.WillGetString("title")
	inBody := jsonMap.WillGetString("body")
	if inTitle == "" || inBody == "" || jsonMap.Err != nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("标题或内容不能为空3"))
		return
	}

	nowTime := time.Now()
	dataRow := datastore.NewDataRow()

	// 新增记录
	if uid == helpers.EmptyUuid() {
		uid = helpers.MustUuid()
		dataRow.SetString("uid", uid)
	}

	dataRow = dataRow.SetStringChain("uid", uid).SetStringChainFrom("title", jsonMap).
		SetStringChain("header", "{}").SetStringChain("body", "{}").
		SetNullStringChainFrom("description", jsonMap).SetNullStringChainFrom("keywords", jsonMap).
		SetIntChain("status", 0).SetStringChainFrom("cover", jsonMap).
		SetNullUuidStringChain("owner", accountModel.Uid).SetNullUuidStringChainFrom("channel", jsonMap).
		SetIntChain("discover", 0).SetNullUuidStringChainFrom("partition", jsonMap).
		SetNullTimeChain("create_time", nowTime).SetNullTimeChain("update_time", nowTime).
		SetNullStringChainFrom("version", jsonMap).SetNullStringChainFrom("build", jsonMap).
		SetNullStringChainFrom("url", jsonMap).SetNullStringChainFrom("branch", jsonMap).
		SetNullStringChainFrom("commit", jsonMap).SetNullTimeChain("commit_time", datetime.NullTime).
		SetNullStringChainFrom("relative_path", jsonMap).SetNullUuidStringChainFrom("repo_id", jsonMap).
		SetStringChainFrom("lang", jsonMap).SetNullStringChainFrom("name", jsonMap).
		SetNullStringChainFrom("checksum", jsonMap).SetNullStringChainFrom("syncno", jsonMap).
		SetNullStringChainFrom("mimetype", jsonMap).SetStringChainFrom("url", jsonMap)
	dataRow.SetString("path", parentPath+"."+uid)
	dataRow.SetString("parent", parent)

	if dataRow.Err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(dataRow.Err, "参数错误2"))
		return
	}

	err = pgUpdateFile(dataRow)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "插入笔记出错"))
		return
	}

	result := nemodels.NECodeOk.WithData(map[string]any{
		"changes": 1,
		"uid":     uid,
	})

	gctx.JSON(http.StatusOK, result)
}

func pgUpdateFile(dataRow *datastore.DataRow) error {

	sqlText := `insert into community.files(uid, title, header, body, create_time, update_time, keywords, description, status, 
	cover, owner, discover, version, url, 
	lang, name, checksum, syncno, mimetype, parent, path)
values(:uid, :title, :header, :body, :create_time, :update_time, :keywords, :description, :status, :cover, :owner, 
	:discover, :version, :url, 
	:lang, :name, :checksum, :syncno, :mimetype, :parent, :path);`

	paramsMap := dataRow.InnerMap()

	_, err := datastore.NamedExec(sqlText, paramsMap)
	if err != nil {
		return fmt.Errorf("PGConsoleInsertNote: %w", err)
	}

	mimeType := GetNullString(dataRow, "mimetype")
	if mimeType != "" {
		if strings.HasPrefix(mimeType, "image/") {
			err = pgUpdateImage(dataRow)
			if err != nil {
				return fmt.Errorf("PGConsoleInsertNote pgUpdateImage: %w", err)
			}
		} else if strings.HasPrefix(mimeType, "text/") {
			err = pgUpdateNote(dataRow)
			if err != nil {
				return fmt.Errorf("PGConsoleInsertNote pgUpdateImage: %w", err)
			}
		}
	}

	return nil
}

func GetNullString(m *datastore.DataRow, key string) string {

	dataMap := m.InnerMap()
	v, ok := dataMap[key]
	if !ok {
		return ""
	}
	if strVal, ok := v.(string); ok {
		return strVal
	} else if nullVal, ok := v.(sql.NullString); ok {
		if nullVal.Valid {
			return nullVal.String
		}
	}

	return ""
}

func pgUpdateImage(dataRow *datastore.DataRow) error {

	sqlText := `insert into community.files(uid, title, create_time, update_time, keywords, description, status, 
	owner, discover)
values(:uid, :title, :create_time, :update_time, :keywords, :description, :status,:owner, 
	:discover);`

	paramsMap := dataRow.InnerMap()

	_, err := datastore.NamedExec(sqlText, paramsMap)
	if err != nil {
		return fmt.Errorf("PGConsoleInsertNote: %w", err)
	}

	return nil
}

func pgUpdateNote(dataRow *datastore.DataRow) error {

	sqlText := `insert into community.files(uid, title, header, body, create_time, update_time, keywords, description, status, 
	cover, owner, discover)
values(:uid, :title, :header, :body, :create_time, :update_time, :keywords, :description, :status, :cover, :owner, 
	:discover);`

	paramsMap := dataRow.InnerMap()

	_, err := datastore.NamedExec(sqlText, paramsMap)
	if err != nil {
		return fmt.Errorf("pgUpdateNote: %w", err)
	}

	return nil
}

func CloudFileDeleteHandler(gctx *gin.Context) {
	uid := gctx.Param("uid")
	if uid == "" {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("uid不能为空"))
		return
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
	err = pgDeleteFile(accountModel.Uid, uid)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询频道出错"))
		return
	}
	responseResult := nemodels.NECodeOk.WithData(uid)

	gctx.JSON(http.StatusOK, responseResult)
}

func pgDeleteFile(owner, uid string) error {
	if uid == "" {
		return fmt.Errorf("PGConsoleDeleteChannel uid is empty")
	}
	pageSqlText := ` delete from community.files where (owner = :owner and uid = :uid); `

	pageSqlParams := map[string]interface{}{
		"uid":   uid,
		"owner": owner,
	}

	_, err := datastore.NamedQuery(pageSqlText, pageSqlParams)
	if err != nil {
		return fmt.Errorf("NamedQuery: %w", err)
	}

	return nil
}
