package notebook

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"portal/business/articles"
	"portal/services/base58"

	"github.com/pnnh/neutron/helpers/jsonmap"
	nemodels "github.com/pnnh/neutron/models"
	"github.com/pnnh/neutron/services/checksum"
	"github.com/pnnh/neutron/services/filesystem"

	"github.com/adrg/frontmatter"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func listNoteFiles(targetDir string) ([]*jsonmap.JsonMap, error) {
	dir := targetDir

	entries, err := os.ReadDir(dir)
	if err != nil {
		return nil, fmt.Errorf("Error reading directory %q: %v\n", dir, err)
	}

	var noteFiles []*jsonmap.JsonMap
	for _, entry := range entries {
		// 获取名称
		fileName := entry.Name()

		var noteFilePath string
		if entry.IsDir() && strings.HasSuffix(fileName, ".note") {
			fullPath := filepath.Join(dir, fileName, "index.md")
			noteFilePath = fullPath
		} else if strings.HasSuffix(fileName, ".md") {
			fullPath := filepath.Join(dir, fileName)
			noteFilePath = fullPath
		}
		if noteFilePath == "" {
			continue
		}
		if _, err := os.Stat(noteFilePath); err != nil {
			logrus.Warnln("listNoteFiles error: ", noteFilePath, err)
			continue
		}

		noteData, err := os.ReadFile(noteFilePath)
		if err != nil {
			return nil, fmt.Errorf("读取文件失败: %w", err)
		}
		noteText := string(noteData)
		matter := &articles.MTNoteMatter{}
		restData, err := frontmatter.Parse(strings.NewReader(string(noteText)), matter)
		if err != nil {
			return nil, fmt.Errorf("解析文章元数据失败: %w", err)
		}
		restText := string(restData)
		noteTitle := strings.Trim(matter.Title, " \n\r\t ")
		if noteTitle == "" {
			noteTitle = strings.TrimSuffix(fileName, filepath.Ext(fileName))
		}

		sumValue, err := checksum.CalcSha256(noteFilePath)
		if err != nil {
			return nil, fmt.Errorf("计算文件校验和失败: %w", err)
		}
		dataRow := jsonmap.NewJsonMap()
		dataRow.SetString("uid", sumValue)
		dataRow.SetString("title", noteTitle)
		dataRow.SetString("header", "MTNote")
		dataRow.SetString("body", restText)
		dataRow.SetString("url", "file://"+noteFilePath)

		noteFiles = append(noteFiles, dataRow)

	}
	return noteFiles, nil
}

// 在主机模式下遍历某个目录下的笔记列表
func HostNoteSelectHandler(gctx *gin.Context) {
	dirParam := gctx.Query("dir")
	if dirParam == "" {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(fmt.Errorf("dir参数不能为空"), "查询笔记出错"))
		return
	}
	dirData, err := base58.DecodeBase58String(dirParam)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询笔记出错"))
		return
	}
	targetDir := string(dirData)
	selectResult, err := listNoteFiles(targetDir)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询笔记出错"))
		return
	}

	rangeMap := make([]map[string]interface{}, 0)
	for _, v := range selectResult {
		rangeMap = append(rangeMap, v.InnerMap())
	}

	resp := map[string]any{
		"page":  1,
		"size":  1,
		"count": 1,
		"range": rangeMap,
	}

	responseResult := nemodels.NECodeOk.WithData(resp)

	gctx.JSON(http.StatusOK, responseResult)
}

func HostNoteFileHandler(gctx *gin.Context) {
	dirParam := gctx.Query("file")
	if dirParam == "" {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(fmt.Errorf("dir参数不能为空"), "查询笔记出错"))
		return
	}

	dirData, err := base58.DecodeBase58String(dirParam)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询笔记出错"))
		return
	}
	targetFile := string(dirData)

	gctx.File(targetFile)
}

func HostNoteContentHandler(gctx *gin.Context) {
	dirParam := gctx.Query("uid")
	if dirParam == "" {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(fmt.Errorf("file参数不能为空"), "查询笔记出错"))
		return
	}

	dirData, err := base58.DecodeBase58String(dirParam)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询笔记出错"))
		return
	}
	targetFile := string(dirData)
	if strings.HasPrefix(targetFile, "file://") {
		targetFile = strings.TrimPrefix(targetFile, "file://")
	} else {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(fmt.Errorf("file参数格式错误"), "查询笔记出错"))
		return
	}

	noteFilePath, err := filesystem.ResolvePath(targetFile)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询笔记出错1"))
		return
	}
	pathStat, err := os.Stat(noteFilePath)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询笔记出错2"))
		return
	}

	if pathStat.IsDir() {
		noteFilePath = filepath.Join(noteFilePath, "index.md")
	}

	noteData, err := os.ReadFile(noteFilePath)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询笔记出错3"))
		return
	}
	noteText := string(noteData)
	matter := &articles.MTNoteMatter{}
	restData, err := frontmatter.Parse(strings.NewReader(string(noteText)), matter)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询笔记出错5"))
		return
	}
	restText := string(restData)
	noteTitle := strings.Trim(matter.Title, " \n\r\t ")
	if noteTitle == "" {
		noteTitle = strings.TrimSuffix(noteFilePath, filepath.Ext(noteFilePath))
	}

	sumValue, err := checksum.CalcSha256(noteFilePath)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询笔记出错6"))
		return
	}
	dataRow := jsonmap.NewJsonMap()
	dataRow.SetString("uid", sumValue)
	dataRow.SetString("title", noteTitle)
	dataRow.SetString("header", "MTNote")
	dataRow.SetString("body", restText)

	responseResult := nemodels.NECodeOk.WithData(dataRow.InnerMap())

	gctx.JSON(http.StatusOK, responseResult)
}
