package repo

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/pnnh/neutron/services/datastore"

	"github.com/jmoiron/sqlx"
)

type MTRepoModel struct {
	Uid       string `json:"uid"`
	RemoteUrl string `json:"remote_url" db:"remote_url"`
	FilePath  string `json:"file_path" db:"file_path"`
}

type MTRepoSyncModel struct {
	Uid           string `json:"uid"`
	LastCommitId  string `json:"last_commit_id" db:"last_commit_id"`
	FirstCommitId string `json:"first_commit_id" db:"first_commit_id"`
	Branch        string `json:"branch"`
	RepoId        string `json:"repo_id" db:"repo_id"`
	SourcePath    string `json:"source_path" db:"source_path"`
}

func PGGetRepoSyncInfo(repoId, branch string) (*MTRepoSyncModel, error) {

	pageSqlText := ` select * from repo_sync where repo_id = :repo_id and branch = :branch; `
	pageSqlParams := map[string]interface{}{
		"repo_id": repoId,
		"branch":  branch,
	}
	var sqlResults []*MTRepoSyncModel

	rows, err := datastore.NamedQuery(pageSqlText, pageSqlParams)
	if err != nil {
		return nil, fmt.Errorf("NamedQuery: %w", err)
	}
	if err = sqlx.StructScan(rows, &sqlResults); err != nil {
		return nil, fmt.Errorf("StructScan: %w", err)
	}

	for _, item := range sqlResults {
		return item, nil
	}
	return nil, nil
}

func PGInsertOrUpdateRepoSyncInfo(model *MTRepoSyncModel) error {
	sqlText := `insert into repo_sync(uid, last_commit_id, branch, repo_id, source_path, first_commit_id)
values(:uid, :last_commit_id, :branch, :repo_id, :source_path, :first_commit_id)
on conflict (uid)
do update set last_commit_id=excluded.last_commit_id, branch=excluded.branch, repo_id=excluded.repo_id,
	first_commit_id=excluded.first_commit_id; `

	sqlParams := map[string]interface{}{
		"uid":             model.Uid,
		"branch":          model.Branch,
		"last_commit_id":  model.LastCommitId,
		"repo_id":         model.RepoId,
		"source_path":     model.SourcePath,
		"first_commit_id": model.FirstCommitId,
	}

	_, err := datastore.NamedExec(sqlText, sqlParams)
	if err != nil {
		return fmt.Errorf("PGInsertOrUpdateRepoSyncInfo: %w", err)
	}
	return nil
}

type MtRepoFileModel struct {
	Uid             string         `json:"uid"`
	Branch          string         `json:"branch"`
	CommitId        string         `json:"commit_id" db:"commit_id"`
	SrcPath         string         `json:"src_path" db:"src_path"`
	TargetPath      string         `json:"target_path" db:"target_path"`
	Mime            string         `json:"mime"`
	CreateTime      time.Time      `json:"create_time" db:"create_time"`
	UpdateTime      time.Time      `json:"update_time" db:"update_time"`
	Checksum        sql.NullString `json:"checksum" db:"checksum"`
	Syncno          sql.NullString `json:"syncno" db:"syncno"`
	RepoId          sql.NullString `json:"repo_id" db:"repo_id"`
	RepoFirstCommit sql.NullString `json:"repo_first_commit" db:"repo_first_commit"`
	RelativePath    sql.NullString `json:"relative_path" db:"relative_path"`
	IsDir           sql.NullBool   `json:"is_dir" db:"is_dir"`
}

func PGInsertOrUpdateRepoFile(model *MtRepoFileModel) error {
	sqlText := `insert into repo_files(uid, branch, commit_id, src_path, target_path, mime, create_time, update_time,
checksum, syncno, repo_id, repo_first_commit, relative_path, is_dir)
values(:uid, :branch, :commit_id, :src_path, :target_path, :mime, now(), now(), :checksum, :syncno, :repo_id, 
	:repo_first_commit, :relative_path, :is_dir)
on conflict (repo_first_commit, branch, relative_path)
do update set commit_id=excluded.commit_id, src_path=excluded.src_path,
		target_path=excluded.target_path, mime=excluded.mime, update_time = now(), checksum=excluded.checksum,
	syncno=excluded.syncno; `

	sqlParams := map[string]interface{}{
		"uid":               model.Uid,
		"branch":            model.Branch,
		"commit_id":         model.CommitId,
		"src_path":          model.SrcPath,
		"target_path":       model.TargetPath,
		"mime":              model.Mime,
		"checksum":          model.Checksum,
		"syncno":            model.Syncno,
		"repo_id":           model.RepoId,
		"repo_first_commit": model.RepoFirstCommit,
		"relative_path":     model.RelativePath,
		"is_dir":            model.IsDir,
	}

	_, err := datastore.NamedExec(sqlText, sqlParams)
	if err != nil {
		return fmt.Errorf("PGInsertOrUpdateRepoFile: %w", err)
	}
	return nil
}
