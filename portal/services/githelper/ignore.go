package githelper

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/sabhiram/go-gitignore"
)

type GitIgnoreWarpper struct {
	ignoreContent string
	ignoreFileDir string
	gitIgnore     *ignore.GitIgnore
}

// 基于.gitignore文件的忽略规则判断某个文件是否需要忽略
// 需要处理多级目录下的.gitignore文件，根据需要合并父子级目录下的.gitignore文件
type GitIgnoreHelper struct {
	ignoreMap    map[string]*GitIgnoreWarpper
	repoRootPath string
}

func NewGitIgnoreHelper(repoRootPath string) *GitIgnoreHelper {
	return &GitIgnoreHelper{
		ignoreMap:    make(map[string]*GitIgnoreWarpper),
		repoRootPath: repoRootPath,
	}
}

func (helper *GitIgnoreHelper) findParentIgnore(ignoreFilePath string) (*GitIgnoreWarpper, error) {
	pathDir := filepath.Dir(ignoreFilePath)
	var length = 0
	var bestKey = ""
	for k, _ := range helper.ignoreMap {
		if strings.HasPrefix(pathDir, k) && len(k) > length {
			length = len(k)
			bestKey = k
		}
	}
	if length == 0 {
		return nil, nil
	}
	return helper.ignoreMap[bestKey], nil
}

func (helper *GitIgnoreHelper) AppendGitIgnoreFile(filePath string) error {

	ignoreContent, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("ReadFile: %w", err)
	}
	parentIgnore, err := helper.findParentIgnore(filePath)
	if err != nil {
		return fmt.Errorf("findParentIgnore: %w", err)
	}
	currentIgnoreContent := string(ignoreContent)
	if parentIgnore != nil {
		currentIgnoreContent = parentIgnore.ignoreContent + "\n" + currentIgnoreContent
	}

	ignoreLines := strings.Split(currentIgnoreContent, "\n")
	compiledIgnore := ignore.CompileIgnoreLines(ignoreLines...)
	ignoreFileDir := filepath.Dir(filePath)
	helper.ignoreMap[ignoreFileDir] = &GitIgnoreWarpper{
		ignoreContent: currentIgnoreContent,
		gitIgnore:     compiledIgnore,
		ignoreFileDir: ignoreFileDir,
	}
	return nil
}

func (helper *GitIgnoreHelper) findBestIgnore(ignoreFilePath string) (*GitIgnoreWarpper, error) {
	pathDir := filepath.Dir(ignoreFilePath)
	var length = 0
	var bestKey = ""
	for k, _ := range helper.ignoreMap {
		if strings.HasPrefix(pathDir, k) && len(k) > length {
			length = len(k)
			bestKey = k
		}
	}
	if length == 0 {
		return nil, nil
	}
	return helper.ignoreMap[bestKey], nil
}

func (helper *GitIgnoreHelper) MatchsPath(path string) (bool, error) {
	if path == "" {
		return false, nil
	}
	if strings.Index(path, ".git") >= 0 {
		return true, nil
	}
	if strings.Index(path, ".DS_Store") >= 0 {
		return true, nil
	}
	//if strings.HasPrefix(path, ".") {
	//	return true, nil
	//}
	//baseName := filepath.Base(path)
	//if strings.HasPrefix(baseName, ".") {
	//	return true, nil
	//}
	//if strings.Index(path, "target") >= 0 {
	//	logrus.Println("TODO: ", path)
	//}
	bestIgnore, err := helper.findBestIgnore(path)
	if err != nil {
		return false, fmt.Errorf("findBestIgnore: %w", err)
	}
	if bestIgnore == nil {
		return false, nil
	}
	relativePath := strings.TrimPrefix(path, bestIgnore.ignoreFileDir)
	matchPath := bestIgnore.gitIgnore.MatchesPath(relativePath)
	return matchPath, nil
}
