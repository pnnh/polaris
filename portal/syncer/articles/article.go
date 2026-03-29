package articles

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"portal/services"
	"portal/services/PTFilesystem"
	"portal/services/PTHash"
	"portal/services/base58"

	"gopkg.in/yaml.v3"

	"github.com/pnnh/neutron/config"
	"github.com/pnnh/neutron/helpers/jsonmap"
	"github.com/pnnh/neutron/services/filesystem"

	"github.com/pnnh/neutron/helpers"
	"github.com/pnnh/neutron/services/checksum"
	"github.com/sirupsen/logrus"
)

// 一个固定的用户ID，通过Syncer服务同步的文章属于这个用户
const SyncerArticleOwner = "01990e6a-2689-731b-a5a2-b46117e22040"
const SyncParentUid = "76de121c-0fab-11f1-a643-6c02e0549f86"

type dirStat struct {
	uid    string
	synced bool
	path   string // 当前目录相对于根目录的完整路径，postgresql ltree格式，以点分隔目录UID
}

type ArticleWorker struct {
	repoWorker *RepoWorker
	rootPath   string
	repoId     string
	syncno     string
	dirStatMap map[string]*dirStat
}

func NewArticleWorker(repoWorker *RepoWorker, rootPath string, syncno string) (*ArticleWorker, error) {
	worker := &ArticleWorker{
		repoWorker: repoWorker,
		rootPath:   rootPath,
		syncno:     syncno,
		dirStatMap: make(map[string]*dirStat),
	}
	worker.dirStatMap[rootPath] = &dirStat{uid: SyncParentUid, synced: true, path: SyncParentUid}
	repoFilePath := filepath.Join(rootPath, ".polaris", "repo.yml")

	repoFilePath, err := filesystem.ResolvePath(repoFilePath)
	if err != nil {
		return nil, fmt.Errorf("ParseConfigFile ResolvePath: %w", err)
	}
	if _, err := os.Stat(repoFilePath); !os.IsNotExist(err) {
		repoFileString, err := PTFilesystem.PTReadFileAsString(repoFilePath)
		if err != nil {
			return nil, fmt.Errorf("读取repo.yml文件失败: %w", err)
		}
		configMap := make(map[string]any)
		err = yaml.Unmarshal([]byte(repoFileString), &configMap)
		if err != nil {
			return nil, fmt.Errorf("解析配置内容出错: %w", err)
		}
		if repoIdValue, ok := configMap["REPOID"]; ok {
			if repoIdStr, ok := repoIdValue.(string); ok && helpers.IsUuid(repoIdStr) {
				worker.repoId = repoIdStr
			}
		}
	}
	if worker.repoId == "" {
		worker.repoId = helpers.MustUuid()
	}

	return worker, nil
}

func (w *ArticleWorker) StartWork() {
	err := filepath.Walk(w.rootPath, w.visitFile)
	if err != nil {
		logrus.Fatalln("error walking the path", w.rootPath, err)
	}
}

// 通过rootPath和文件相对路径计算出一个唯一的文件UID，保证同一目录结构下相同文件路径的UID一致
func (w *ArticleWorker) calcFileUid(path string) (string, error) {
	rawStr := fmt.Sprintf("%s-%s", w.repoId, path)
	md5Val, err := PTHash.PTCalculateMD5String(rawStr)
	if err != nil {
		return "", fmt.Errorf("计算文件UID失败: %w", err)
	}
	uid, err := PTHash.PTMd5ToUuid(md5Val)
	if err != nil {
		return "", fmt.Errorf("MD5转换为UUID失败: %w", err)
	}
	return uid, nil
}

func (w *ArticleWorker) visitFile(path string, info os.FileInfo, visitErr error) error {
	if visitErr != nil {
		return fmt.Errorf("error walking the path %s, %w", path, visitErr)
	}
	if path == w.rootPath {
		return nil // 根目录本身不处理，直接遍历其下的文件或目录
	}

	fileName := filepath.Base(path)
	if info.IsDir() && strings.HasPrefix(fileName, ".") {
		return filepath.SkipDir
	}
	if filesystem.IsIgnoredPath(path) {
		if info.IsDir() {
			return filepath.SkipDir
		}
		// 匹配到忽略的文件时继续遍历当前目录下的其它文件或目录
		return nil
	}
	sumValue := ""
	mimeType := ""
	newUid, err := w.calcFileUid(path)
	if err != nil {
		logrus.Errorf("CalcFileUid Uid err: %+v", err)
		return nil
	}
	parentUid := ""
	parentDir := filepath.Dir(path)
	parentDirStat := w.dirStatMap[parentDir]
	if parentDirStat == nil {
		panic("未找到父目录的统计信息2，路径: " + parentDir)
	}
	if info.IsDir() {
		mimeType = "directory"
		w.dirStatMap[path] = &dirStat{uid: newUid, synced: false, path: parentDirStat.path + "." + newUid}
	} else {
		sum, err := checksum.CalcSha256(path)
		if err != nil {
			return fmt.Errorf("计算文件校验和失败: %w", err)
		}
		sumValue = sum
		mimeType = helpers.GetMimeType(path)
	}

	if !parentDirStat.synced {
		return filepath.SkipDir
	}
	parentUid = parentDirStat.uid

	noteTitle := strings.Trim(fileName, " \n\r\t ")
	if noteTitle == "" {
		noteTitle = strings.TrimSuffix(info.Name(), filepath.Ext(info.Name()))
	}

	nowTime := time.Now()
	dataRow := jsonmap.NewJsonMap()
	dataRow.SetString("uid", newUid)
	dataRow.SetString("title", noteTitle)
	dataRow.SetString("header", "{}")
	dataRow.SetString("body", "{}")
	dataRow.SetString("description", "")
	dataRow.SetString("keywords", "")
	dataRow.SetInt("status", 1)
	dataRow.SetNullString("cover", "")
	dataRow.SetString("owner", SyncerArticleOwner)
	dataRow.SetNullString("channel", "")
	dataRow.SetInt("discover", 0)
	dataRow.SetNullString("partition", "")
	dataRow.SetTime("create_time", nowTime)
	dataRow.SetTime("update_time", nowTime)
	dataRow.SetNullString("version", "0")
	dataRow.SetString("lang", "")
	dataRow.SetNullString("parent", parentUid)
	dataRow.SetNullString("name", fileName)
	dataRow.SetNullString("checksum", sumValue)
	dataRow.SetNullString("syncno", w.syncno)
	dataRow.SetNullString("mimetype", mimeType)
	dataRow.SetString("url", "")
	dataRow.SetString("path", w.dirStatMap[parentDir].path+"."+newUid)

	targetPath := ""
	if !info.IsDir() {
		logrus.Infoln("同步文件: ", path, "，checksum: ", sumValue)

		targetParentDir, err := base58.UuidToBase58(parentUid)
		if err != nil {
			logrus.Errorf("转换父目录UID失败: %v", err)
			return nil
		}
		targetSelfName, err := base58.UuidToBase58(newUid)
		if err != nil {
			logrus.Errorf("转换文件UID失败: %v", err)
			return nil
		}
		if !strings.HasPrefix(fileName, ".") {
			extName := filepath.Ext(fileName)
			if extName != "" {
				targetSelfName += extName
			}
		}
		targetPath = fmt.Sprintf("%s/%s", targetParentDir, targetSelfName)
		targetUrl := fmt.Sprintf("storage://%s", targetPath)
		dataRow.SetString("url", targetUrl)
	}

	// 根目录本身不插入数据库记录，直接遍历其下的文件或目录
	if path == w.rootPath {
		return nil
	}

	portalUrl, ok := config.GetConfigurationString("INTERNAL_PORTAL_URL")
	if !ok || portalUrl == "" {
		return fmt.Errorf("INTERNAL_PORTAL_URL 未配置2")
	}
	// 插入文章数据到Portal服务，仅开发阶段执行
	postUrl := fmt.Sprintf("%s/cloud/files/%s?debug=true", portalUrl, newUid)
	dataString, err := services.PTMarshalJsonMapToString(dataRow)
	if err != nil {
		return fmt.Errorf("序列化数据失败: %w", err)
	}
	reader := strings.NewReader(dataString)
	request, err := http.NewRequest("POST", postUrl, reader)
	if err != nil {
		return fmt.Errorf("创建HTTP请求失败: %w", err)
	}
	request.Header.Set("Content-Type", "application/json")
	//err := PGInsertFile(dataRow)
	response, err := http.DefaultClient.Do(request)
	if err != nil {
		logrus.Errorf("插入文件数据失败: %s %v", fileName, err)
		return nil
	}
	defer func() {
		if err := response.Body.Close(); err != nil {
			logrus.Errorf("关闭HTTP响应体失败: %v", err)
		}
	}()
	if response.StatusCode != http.StatusOK {
		logrus.Errorf("插入文件数据失败，HTTP状态码: %d", response.StatusCode)
		return nil
	}

	if !info.IsDir() {
		w.repoWorker.AddJob(path, targetPath)
	} else {
		currentDirStat := w.dirStatMap[path]
		if currentDirStat != nil {
			currentDirStat.synced = true
		}
	}

	return nil
}
