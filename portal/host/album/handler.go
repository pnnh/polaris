package album

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"portal/services/base58"

	"github.com/pnnh/neutron/helpers"
	"github.com/pnnh/neutron/helpers/jsonmap"
	nemodels "github.com/pnnh/neutron/models"
	"github.com/pnnh/neutron/services/checksum"
	"github.com/pnnh/neutron/services/filesystem"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

func listImageFiles(targetDir string) ([]*jsonmap.JsonMap, error) {
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
		if helpers.IsImageFile(fileName) {
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

		sumValue, err := checksum.CalcSha256(noteFilePath)
		if err != nil {
			return nil, fmt.Errorf("计算文件校验和失败: %w", err)
		}
		dataRow := jsonmap.NewJsonMap()
		dataRow.SetString("title", fileName)
		dataRow.SetString("uid", sumValue)
		dataRow.SetString("url", "file://"+noteFilePath)

		noteFiles = append(noteFiles, dataRow)

	}
	return noteFiles, nil
}

// 在主机模式下遍历某个目录下的笔记列表
func HostImageSelectHandler(gctx *gin.Context) {
	dirParam := gctx.Query("dir")
	if dirParam == "" {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(fmt.Errorf("dir参数不能为空"), "查询笔记出错"))
		return
	}
	dirData, err := base58.DecodeBase58String(dirParam)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询笔记出错2"))
		return
	}
	targetDir := string(dirData)
	selectResult, err := listImageFiles(targetDir)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询笔记出错2"))
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

func HostImageFileHandler(gctx *gin.Context) {
	dirParam := gctx.Query("file")
	if dirParam == "" {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(fmt.Errorf("dir参数不能为空"), "查询笔记出错"))
		return
	}
	dirData, err := base58.DecodeBase58String(dirParam)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询笔记出错2"))
		return
	}
	targetFile := string(dirData)

	noteFilePath, err := filesystem.ResolvePath(targetFile)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "查询笔记出错1"))
		return
	}

	gctx.File(noteFilePath)
}
