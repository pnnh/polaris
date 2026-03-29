package articles

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/pnnh/neutron/helpers"
	nemodels "github.com/pnnh/neutron/models"
	"github.com/pnnh/neutron/services/datastore"
	"portal/models/repo"
	"portal/services/githelper"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
)

func NoteAssetsSelectHandler(gctx *gin.Context) {
	uid := gctx.Param("uid")
	if uid == "" {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("uid不能为空"))
		return
	}
	parent := gctx.Query("parent")
	decodedParent := ""
	if parent != "" {
		decodeString, err := base64.URLEncoding.DecodeString(parent)
		if err != nil {
			gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "DecodeString parent出错"))
			return
		}
		decodedParent = string(decodeString)
	}

	noteTable, err := PGGetNote(uid, "en")
	if err != nil || noteTable == nil {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithError(err))
		return
	}

	repoFirstCommit := noteTable.GetStringOrEmpty("repo_first_commit")
	branch := noteTable.GetStringOrEmpty("branch")
	url := noteTable.GetStringOrEmpty("url")
	relativePath := noteTable.GetStringOrEmpty("relative_path")
	if repoFirstCommit == "" || branch == "" {
		gctx.JSON(http.StatusOK, nemodels.NECodeError.WithMessage("RepoFirstCommit或Branch为空"))
		return
	}
	noteDir := strings.ReplaceAll(filepath.Dir(relativePath), string(os.PathSeparator), "/")

	parentDir := noteDir + decodedParent
	fileList, err := listFirstLevelDB(repoFirstCommit, branch, parentDir)
	if err != nil {
		gctx.JSON(http.StatusOK, nemodels.NEErrorResultMessage(err, "listFirstLevel出错"))
		return
	}
	repoUrl := githelper.GitSshUrlToHttps(url)
	resultList := make([]any, 0)
	for _, file := range fileList {
		extName := filepath.Ext(file.RelativePath.String)
		baseName := filepath.Base(file.RelativePath.String)
		fullRepoUrl := fmt.Sprintf("%s/blob/%s%s", repoUrl, branch,
			file.RelativePath.String)
		fileStoragePath := fmt.Sprintf("/%s/%s%s", repoFirstCommit, branch, file.RelativePath.String)
		fileView := &MTNoteFileModel{
			Title:        baseName,
			Path:         strings.TrimPrefix(file.RelativePath.String, noteDir),
			IsDir:        file.IsDir.Bool,
			IsText:       helpers.IsTextFile(extName),
			IsImage:      helpers.IsImageFile(extName),
			StoragePath:  fileStoragePath,
			FullRepoPath: fullRepoUrl,
		}
		resultList = append(resultList, fileView)
	}
	selectData := &nemodels.NESelectResponse{
		Page:  1,
		Size:  999,
		Count: len(fileList),
		Range: resultList,
	}
	responseResult := nemodels.NECodeOk.WithData(selectData)

	gctx.JSON(http.StatusOK, responseResult)
}

func listFirstLevelDB(repoFirstCommit, repoBranch, currentDir string) ([]*repo.MtRepoFileModel, error) {
	baseSqlText := ` select * from repo_files `
	baseSqlParams := map[string]interface{}{}

	whereText := ` where repo_first_commit = :repo_first_commit and branch = :branch  
		and relative_path like :parent_path
        and relative_path not like :parent_path2
`
	baseSqlParams["repo_first_commit"] = repoFirstCommit
	baseSqlParams["branch"] = repoBranch
	baseSqlParams["parent_path"] = currentDir + "/%"
	baseSqlParams["parent_path2"] = currentDir + "/%/%"

	pageSqlText := fmt.Sprintf("%s %s %s", baseSqlText, whereText, ` limit 256; `)

	var sqlResults []*repo.MtRepoFileModel

	rows, err := datastore.NamedQuery(pageSqlText, baseSqlParams)
	if err != nil {
		return nil, fmt.Errorf("NamedQuery: %w", err)
	}

	if err = sqlx.StructScan(rows, &sqlResults); err != nil {
		return nil, fmt.Errorf("StructScan: %w", err)
	}

	return sqlResults, nil
}
