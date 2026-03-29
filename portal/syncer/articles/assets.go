package articles

import (
	"fmt"
	"os"
	"path/filepath"
	"sync"

	"portal/services/PTFilesystem"

	"github.com/pnnh/neutron/config"
	"github.com/pnnh/neutron/services/filesystem"

	"github.com/sirupsen/logrus"
)

type CopyJob struct {
	sourcePath string
	targetPath string
}

type MTFilePorter struct {
	targetRootPath string
}

func MTNewFilePorter(targetPath string) (*MTFilePorter, error) {

	resolvedPath, err := filesystem.ResolvePath(targetPath)
	if err != nil {
		logrus.Fatalln("NewFilePorter解析路径失败", err)
		return nil, fmt.Errorf("NewFilePorter解析路径失败")
	}
	return &MTFilePorter{targetRootPath: resolvedPath}, nil
}

func (p *MTFilePorter) CopyFile(srcPath, targetPath string) (string, error) {
	targetDir := filepath.Dir(targetPath)
	fullTargetDir := filepath.Join(p.targetRootPath, string(os.PathSeparator), targetDir)
	err := PTFilesystem.MTCreateDir(fullTargetDir)
	if err != nil {
		return "", fmt.Errorf("MkdirAll: %w", err)
	}
	fullTargetPath := filepath.Join(p.targetRootPath, string(os.PathSeparator), targetPath)
	err = filesystem.CopyFile(srcPath, fullTargetPath)
	if err != nil {
		return "", fmt.Errorf("CopyFile: %w", err)
	}

	return fullTargetPath, nil
}

type RepoWorker struct {
	repoChan   chan *CopyJob
	filePorter *MTFilePorter
	wg         *sync.WaitGroup
	syncno     string
}

func NewRepoWorker(wg *sync.WaitGroup, syncno string) (*RepoWorker, error) {
	storageUrl, ok := config.GetConfigurationString("STORAGE_URL")
	if !ok || storageUrl == "" {
		logrus.Fatalln("STORAGE_URL 未配置")
	}
	filePorter, err := MTNewFilePorter(storageUrl)
	if err != nil {
		logrus.Errorln("初始化FilePorter失败", err)
		return nil, fmt.Errorf("初始化FilePorter失败")
	}

	return &RepoWorker{
		repoChan:   make(chan *CopyJob, 3),
		filePorter: filePorter,
		wg:         wg,
		syncno:     syncno,
	}, nil
}

func (w *RepoWorker) AddJob(sourcePath, targetPath string) {
	copyStruct := &CopyJob{
		sourcePath: sourcePath,
		targetPath: targetPath,
	}
	w.repoChan <- copyStruct
}

func (w *RepoWorker) StartWork() {
	defer func() {
		logrus.Infoln("RepoWorker 退出")
		w.wg.Done()
	}()
	for {
		select {
		case copyStruct := <-w.repoChan:
			path := copyStruct.sourcePath
			targetPath := copyStruct.targetPath
			_, err := w.filePorter.CopyFile(path, targetPath)
			if err != nil {
				logrus.Println("CopyFile: ", err)
			}
		}
	}
}
