package syncer

import (
	"fmt"
	"sync"
	"time"

	"portal/syncer/articles"

	"github.com/pnnh/neutron/services/filesystem"

	"github.com/pnnh/neutron/config"
	"github.com/pnnh/neutron/services/datastore"

	"github.com/sirupsen/logrus"
)

// 该程序用于定时同步文章和仓库
// 考虑到简化实现，目前仅能够一次性执行，无法作为服务运行
func SyncerMain(configFlag string) {
	logrus.Println("Hello, Syncer!")

	err := config.InitAppConfig(configFlag, "huable", "polaris", config.GetEnvName(), "syncer")
	if err != nil {
		logrus.Fatalln("初始化配置失败2", err)
	}

	accountDSN, ok := config.GetConfiguration("DATABASE")
	if !ok || accountDSN == nil {
		logrus.Errorln("DATABASE未配置3")
	}

	if err := datastore.Init(accountDSN.(string)); err != nil {
		logrus.Fatalln("datastore: ", err)
	}

	var wg = &sync.WaitGroup{}
	nowTime := time.Now()
	syncno := fmt.Sprintf("SYN%s", nowTime.Format("200601021504"))
	// 文件同步Worker
	repoWorker, err := articles.NewRepoWorker(wg, syncno)
	if err != nil {
		logrus.Errorln("初始化RepoWorker失败", err)
		return
	}

	wg.Add(1)
	go repoWorker.StartWork()

	sourceUrl, ok := config.GetConfiguration("SOURCE_URL")
	if !ok || sourceUrl == nil {
		logrus.Fatalln("SOURCE_URL 未配置")
	}
	sourceDir, err := filesystem.ResolvePath(sourceUrl.(string))

	if err != nil {
		logrus.Fatalln("解析路径失败", err)
		return
	}

	wg.Add(1)
	go SyncDirectoryForever(repoWorker, sourceDir, wg, syncno)

	wg.Wait()
}

func SyncDirectoryForever(repoWorker *articles.RepoWorker, dirPath string, wg *sync.WaitGroup, syncno string) {
	logrus.Println("开始定时同步目录:", dirPath)
	defer func() {
		logrus.Println("停止同步目录:", dirPath)
		wg.Done()
	}()
	logrus.Infoln("开始一次目录同步:", dirPath)
	// 文章同步Worker
	articleWorker, err := articles.NewArticleWorker(repoWorker, dirPath, syncno)
	if err != nil {
		logrus.Errorln("初始化ArticleWorker失败", err)
		return
	}
	articleWorker.StartWork()
}
