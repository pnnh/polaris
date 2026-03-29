package articles

import (
	"database/sql"
	"fmt"
	"path/filepath"
	"time"

	"portal/services/githelper"

	"github.com/pnnh/neutron/helpers"
	"github.com/pnnh/neutron/models"
	"github.com/pnnh/neutron/services/datastore"

	"github.com/jmoiron/sqlx"
	"github.com/sirupsen/logrus"
)

type MTNoteMatter struct {
	Cls         string `json:"cls"`
	Uid         string `json:"uid"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Keywords    string `json:"keywords"`
	Cover       string `json:"cover"`
	Chan        string `json:"chan"`
}

type MTNoteTable struct {
	Uid             string         `json:"uid"`
	Title           string         `json:"title"`
	Header          string         `json:"header"`
	Body            string         `json:"body"`
	Description     string         `json:"description"`
	Keywords        string         `json:"keywords"`
	Status          int            `json:"status"`
	Cover           sql.NullString `json:"-"`
	Owner           string         `json:"-"`
	Channel         sql.NullString `json:"channel"`
	Discover        int            `json:"discover"`
	Partition       sql.NullString `json:"-"`
	CreateTime      time.Time      `json:"create_time" db:"create_time"`
	UpdateTime      time.Time      `json:"update_time" db:"update_time"`
	Version         sql.NullString `json:"-"`
	Build           sql.NullString `json:"-"`
	Url             sql.NullString `json:"-"`
	Branch          sql.NullString `json:"-"`
	Commit          sql.NullString `json:"-" db:"commit"`
	CommitTime      sql.NullTime   `json:"-" db:"commit_time"`
	RelativePath    sql.NullString `json:"-" db:"relative_path"`
	RepoId          sql.NullString `json:"-" db:"repo_id"`
	Lang            string         `json:"lang" db:"lang"`
	Name            string         `json:"name" db:"name"`
	Checksum        sql.NullString `json:"checksum" db:"checksum"` // 用于标识内容是否变更
	Syncno          sql.NullString `json:"-" db:"syncno"`          // 用于标识同步批次
	RepoFirstCommit sql.NullString `json:"-" db:"repo_first_commit"`
}

func (t *MTNoteTable) ToModel() *MTNoteModel {
	return &MTNoteModel{
		MTNoteTable:     *t,
		Partition:       t.Partition.String,
		Version:         t.Version.String,
		Build:           t.Build.String,
		Url:             t.Url.String,
		Branch:          t.Branch.String,
		Commit:          t.Commit.String,
		CommitTime:      t.CommitTime.Time,
		RelativePath:    t.RelativePath.String,
		RepoId:          t.RepoId.String,
		Channel:         t.Channel.String,
		CheckSum:        t.Checksum.String,
		Syncno:          t.Syncno.String,
		RepoFirstCommit: t.RepoFirstCommit.String,
	}
}

type MTNoteModel struct {
	MTNoteTable
	Partition       string    `json:"partition"`
	Version         string    `json:"version"`
	Build           string    `json:"build"`
	Url             string    `json:"url"`
	Branch          string    `json:"branch"`
	Commit          string    `json:"commit" db:"commit"`
	CommitTime      time.Time `json:"commit_time" db:"commit_time"`
	RelativePath    string    `json:"relative_path" db:"relative_path"`
	RepoId          string    `json:"repo_id" db:"repo_id"`
	Channel         string    `json:"channel" db:"channel"`
	Cover           string    `json:"cover" db:"cover"`
	CheckSum        string    `json:"checksum" db:"checksum"`
	Syncno          string    `json:"syncno" db:"syncno"`
	RepoFirstCommit string    `json:"-" db:"repo_first_commit"`
}

func (m *MTNoteModel) ToViewModel() interface{} {
	view := &MTNoteView{
		MTNoteModel: *m,
	}
	view.Lang = m.Lang
	view.RepoUrl = githelper.GitSshUrlToHttps(m.Url)
	view.FullRepoUrl = fmt.Sprintf("%s/blob/%s%s", view.RepoUrl, view.Branch, view.RelativePath)
	view.FullRepoPath = fmt.Sprintf("%s/tree/%s%s", view.RepoUrl, view.Branch, filepath.Dir(m.RelativePath))
	return view
}

func (m *MTNoteModel) ToTableMap() (*MTNoteTable, error) {
	table := &MTNoteTable{
		Uid:          m.Uid,
		Title:        m.Title,
		Header:       m.Header,
		Body:         m.Body,
		Description:  m.Description,
		Keywords:     m.Keywords,
		Status:       m.Status,
		Cover:        sql.NullString{String: m.Cover, Valid: true},
		Owner:        m.Owner,
		Channel:      sql.NullString{String: m.Channel, Valid: true},
		Discover:     m.Discover,
		Partition:    sql.NullString{String: m.Partition, Valid: true},
		CreateTime:   m.CreateTime,
		UpdateTime:   m.UpdateTime,
		Version:      sql.NullString{String: m.Version, Valid: true},
		Build:        sql.NullString{String: m.Build, Valid: true},
		Url:          sql.NullString{String: m.Url, Valid: true},
		Branch:       sql.NullString{String: m.Branch, Valid: true},
		Commit:       sql.NullString{String: m.Commit, Valid: true},
		CommitTime:   sql.NullTime{Time: m.CommitTime, Valid: true},
		RelativePath: sql.NullString{String: m.RelativePath, Valid: true},
		RepoId:       sql.NullString{String: m.RepoId, Valid: true},
		Lang:         m.Lang,
		Name:         m.Name,
		Checksum:     sql.NullString{String: m.CheckSum, Valid: true},
		Syncno:       sql.NullString{String: m.Syncno, Valid: true},
	}
	return table, nil
}

type MTNoteView struct {
	MTNoteModel
	Lang         string `json:"lang"`
	RepoUrl      string `json:"repo_url"`
	FullRepoUrl  string `json:"full_repo_url"`
	FullRepoPath string `json:"full_repo_path"`
}

func PGSelectNotes(channel, keyword string, page int, size int, lang string) (*helpers.Pagination,
	[]*datastore.DataRow, error) {
	pagination := helpers.CalcPaginationByPage(page, size)
	baseSqlText := ` select * from community.files `
	baseSqlParams := map[string]interface{}{}

	whereText := ` where status = 1 `
	if keyword != "" {
		whereText += ` and (title ilike :keyword or description ilike :keyword) `
		baseSqlParams["keyword"] = "%" + keyword + "%"
	}
	if channel != "" {
		whereText += ` and channel = :channel `
		baseSqlParams["channel"] = channel
	}
	orderText := ` order by create_time desc `

	pageSqlText := fmt.Sprintf("%s %s %s %s", baseSqlText, whereText, orderText, ` offset :offset limit :limit; `)
	pageSqlParams := map[string]interface{}{
		"offset": pagination.Offset, "limit": pagination.Limit,
	}
	for k, v := range baseSqlParams {
		pageSqlParams[k] = v
	}
	var sqlResults = make([]*datastore.DataRow, 0)

	rows, err := datastore.NamedQuery(pageSqlText, pageSqlParams)
	if err != nil {
		return nil, nil, fmt.Errorf("NamedQuery: %w", err)
	}

	defer func() {
		if closeErr := rows.Close(); closeErr != nil {
			logrus.Warnf("rows.Close: %v", closeErr)
		}
	}()

	for rows.Next() {
		rowMap := make(map[string]interface{})
		if err := rows.MapScan(rowMap); err != nil {
			return nil, nil, fmt.Errorf("MapScan: %w", err)
		}
		tableMap := datastore.MapToDataRow(rowMap)
		sqlResults = append(sqlResults, tableMap)
	}
	if err := rows.Err(); err != nil {
		return nil, nil, fmt.Errorf("rows error: %w", err)
	}

	countSqlText := `select count(1) as count from (` +
		fmt.Sprintf("%s %s", baseSqlText, whereText) + `) as temp;`

	countSqlParams := map[string]interface{}{}
	for k, v := range baseSqlParams {
		countSqlParams[k] = v
	}
	var countSqlResults []struct {
		Count int `db:"count"`
	}

	rows, err = datastore.NamedQuery(countSqlText, countSqlParams)
	if err != nil {
		return nil, nil, fmt.Errorf("NamedQuery: %w", err)
	}
	if err = sqlx.StructScan(rows, &countSqlResults); err != nil {
		return nil, nil, fmt.Errorf("StructScan: %w", err)
	}
	if len(countSqlResults) == 0 {
		return nil, nil, fmt.Errorf("查询笔记总数有误，数据为空")
	}
	pagination.Count = countSqlResults[0].Count
	defer func() {
		if closeErr := rows.Close(); closeErr != nil {
			logrus.Warnf("rows.Close2: %v", closeErr)
		}
	}()

	return pagination, sqlResults, nil
}

func PGGetNoteByChecksum(checksum string) (*MTNoteTable, error) {
	if checksum == "" {
		return nil, fmt.Errorf("PGGetNote uid is empty")
	}
	pageSqlText := ` select * from community.files where checksum= :checksum limit 1; `

	pageSqlParams := map[string]interface{}{
		"checksum": checksum,
	}
	var sqlResults []*MTNoteTable

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

// PGGetNote 获取单个笔记信息
func PGGetNote(uid string, lang string) (*datastore.DataRow, error) {
	if uid == "" {
		return nil, fmt.Errorf("PGGetNote uid is empty")
	}
	pageSqlText := ` select * from community.files where status = 1 and uid = :uid; `

	pageSqlParams := map[string]interface{}{
		"uid":  uid,
		"lang": lang,
	}

	rows, err := datastore.NamedQuery(pageSqlText, pageSqlParams)
	if err != nil {
		return nil, fmt.Errorf("NamedQuery: %w", err)
	}

	defer func() {
		if closeErr := rows.Close(); closeErr != nil {
			logrus.Warnf("rows.Close: %v", closeErr)
		}
	}()

	for rows.Next() {
		rowMap := make(map[string]interface{})
		if err := rows.MapScan(rowMap); err != nil {
			return nil, fmt.Errorf("MapScan: %w", err)
		}
		tableMap := datastore.MapToDataRow(rowMap)
		if tableMap.Err != nil {
			return nil, fmt.Errorf("MapScan2: %w", tableMap.Err)
		}
		return tableMap, nil
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}
	return nil, models.ErrNilValue
}

type MTNoteFileModel struct {
	Title        string `json:"title"`
	Path         string `json:"path"`
	IsDir        bool   `json:"is_dir"`
	IsText       bool   `json:"is_text"`
	IsImage      bool   `json:"is_image"`
	StoragePath  string `json:"storage_path"`
	FullRepoPath string `json:"full_repo_path"` // 完整的仓库路径
}
