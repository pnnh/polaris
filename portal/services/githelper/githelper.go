package githelper

import (
	"fmt"
	"os/exec"
	"runtime"
	"strings"
	"time"
)

type GitInfo struct {
	Branch        string
	CommitId      string
	CommitTime    time.Time
	RemoteUrl     string
	Tracking      string
	IsClean       bool
	RootPath      string
	FirstCommitId string
}

// 获取指定目录的git信息
func GitInfoGet(dirPath string) (*GitInfo, error) {
	gitInfo := &GitInfo{}

	branch, err := GitCurrentBranch(dirPath)
	if err != nil {
		return nil, fmt.Errorf("GitInfoGet: %w", err)
	}
	gitInfo.Branch = branch

	commitId, err := GitCurrentCommitId(dirPath)
	if err != nil {
		return nil, fmt.Errorf("GitInfoGet: %w", err)
	}
	gitInfo.CommitId = commitId

	remoteUrl, err := GitGetRemoteUrl(dirPath)
	if err != nil {
		return nil, fmt.Errorf("GitInfoGet: %w", err)
	}
	gitInfo.RemoteUrl = remoteUrl

	trackingBranch, err := GitGetTrackingBranch(dirPath)
	if err != nil {
		return nil, fmt.Errorf("GitInfoGet: %w", err)
	}
	gitInfo.Tracking = trackingBranch

	err = GitCheckWorkspaceClean(dirPath)
	if err == nil {
		gitInfo.IsClean = true
	}

	commitTime, err := GitGetCommitTime(dirPath, commitId)
	if err != nil {
		return nil, fmt.Errorf("GitInfoGet: %w", err)
	}
	gitInfo.CommitTime, err = time.Parse("2006-01-02 15:04:05 -0700", commitTime)
	if err != nil {
		return nil, fmt.Errorf("GitInfoGet: %w", err)
	}
	rootPath, err := GitGetRepoRoot(dirPath)
	if err != nil {
		return nil, fmt.Errorf("GitInfoGet: %w", err)
	}
	gitInfo.RootPath = rootPath

	firstCommitId, err := GitGetFirstCommitId(dirPath)
	if err != nil {
		return nil, fmt.Errorf("GitInfoGet: %w", err)
	}
	gitInfo.FirstCommitId = firstCommitId

	return gitInfo, nil
}

// 获取指定目录的git远程仓库地址
func GitGetOriginURL(dirPath string, remoteName string) (string, error) {
	cmd := exec.Command("git", "remote", "get-url", remoteName)
	cmd.Dir = dirPath
	out, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf("GitGetOriginURL exec: %w", err)
	}
	originURL := strings.TrimSpace(string(out))
	if originURL == "" {
		return "", fmt.Errorf("GitGetOriginURL empty: %w", err)
	}
	return originURL, nil
}

// 比较两次commit的先后顺序
// 返回值：
// -1: commitId1是commitId2的祖先
// 0: commitId1和commitId2是同一个commit
func GitCommitIsAncestor(dirPath, commitId1, commitId2 string) (bool, error) {
	if commitId1 == commitId2 {
		return false, nil
	}
	// 判断commitId1是否是commitId2的祖先
	cmd := exec.Command("git", "merge-base", "--is-ancestor", commitId1, commitId2)
	cmd.Dir = dirPath
	err := cmd.Run()
	if err == nil {
		return true, nil
	}
	return false, fmt.Errorf("GitCommitIsAncestor: %w", err)
}

// 获取git仓库最初提交的commitId，一般可以作为该仓库的唯一标识
func GitGetFirstCommitId(dirPath string) (string, error) {
	cmd := exec.Command("git", "rev-list", "--max-parents=0", "HEAD")
	cmd.Dir = dirPath
	out, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf("GitGetFirstCommitId exec: %w", err)
	}
	firstCommitId := strings.TrimSpace(string(out))
	if firstCommitId == "" {
		return "", fmt.Errorf("GitGetFirstCommitId empty: %w", err)
	}
	return firstCommitId, nil
}

// 将git ssh地址转换为https地址
func GitSshUrlToHttps(url string) string {
	if strings.HasPrefix(url, "git@") {
		url = strings.Replace(url, ":", "/", 1)
		url = strings.Replace(url, "git@", "https://", 1)
		url = strings.TrimSuffix(url, ".git")
	}
	return url
}

// 获取指定目录的git仓库根目录
func GitGetRepoRoot(dirPath string) (string, error) {
	cmd := exec.Command("git", "rev-parse", "--show-toplevel")
	cmd.Dir = dirPath
	out, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf("GitGetRepoRoot exec: %w", err)
	}
	repoRoot := strings.TrimSpace(string(out))
	if repoRoot == "" {
		return "", fmt.Errorf("GitGetRepoRoot empty: %w", err)
	}
	sysType := runtime.GOOS
	if sysType == "windows" {
		repoRoot = strings.ReplaceAll(repoRoot, "/", "\\")
	}
	return repoRoot, nil
}

var ErrGitWorkspaceNotClean = fmt.Errorf("workspace not clean")

func GitCheckWorkspaceClean(dirPath string) error {
	cmd := exec.Command("git", "status", "--porcelain")
	cmd.Dir = dirPath
	out, err := cmd.Output()

	if err != nil {
		return fmt.Errorf("GitCheckWorkspaceClean exec: %w", err)
	}
	if len(out) > 0 {
		return ErrGitWorkspaceNotClean
	}
	return nil
}

// 获取当前分支的远程跟踪分支
func GitGetTrackingBranch(dirPath string) (string, error) {
	cmd := exec.Command("git", "rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}")
	cmd.Dir = dirPath
	out, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf("GitGetTrackingBranch exec: %w", err)
	}
	trackingBranch := string(out)
	if trackingBranch == "" {
		return "", fmt.Errorf("GitGetTrackingBranch empty: %w", err)
	}
	return trackingBranch[:len(trackingBranch)-1], nil
}

// 获取指定commitId的提交时间
func GitGetCommitTime(dirPath, commitId string) (string, error) {
	cmd := exec.Command("git", "show", "-s", "--format=%ci", commitId)
	cmd.Dir = dirPath
	out, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf("GitGetCommitTime exec: %w", err)
	}
	commitTime := strings.TrimSpace(string(out))
	if commitTime == "" {
		return "", fmt.Errorf("GitGetCommitTime empty: %w", err)
	}
	return commitTime, nil
}

// 获取当前分支的远程仓库地址
func GitGetRemoteUrl(dirPath string) (string, error) {
	cmd := exec.Command("git", "config", "--get", fmt.Sprintf("remote.origin.url"))
	cmd.Dir = dirPath
	out, err := cmd.Output()

	if err != nil {
		return "", fmt.Errorf("GitGetRemoteUrl exec: %w", err)
	}
	remoteUrl := string(out)
	if remoteUrl == "" {
		return "", fmt.Errorf("GitGetRemoteUrl empty: %w", err)
	}
	remoteUrl = strings.Trim(remoteUrl, "\n")
	return remoteUrl, nil
}

func GitCurrentBranch(dirPath string) (string, error) {
	cmd := exec.Command("git", "rev-parse", "--abbrev-ref", "HEAD")
	cmd.Dir = dirPath
	out, err := cmd.Output()

	if err != nil {
		return "", fmt.Errorf("GitCurrentBranch exec: %w", err)
	}
	branch := string(out)
	if branch == "" {
		return "", fmt.Errorf("GitCurrentBranch empty: %w", err)
	}
	return branch[:len(branch)-1], nil
}

func GitCurrentCommitId(dirPath string) (string, error) {
	cmd := exec.Command("git", "rev-parse", "HEAD")
	cmd.Dir = dirPath
	out, err := cmd.Output()

	if err != nil {
		return "", fmt.Errorf("GitCurrentCommitId exec: %w", err)
	}
	commitId := string(out)
	if commitId == "" {
		return "", fmt.Errorf("GitCurrentCommitId empty: %w", err)
	}
	return commitId[:len(commitId)-1], nil
}
