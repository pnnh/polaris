package datastore

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var (
	sqlxdb *sqlx.DB
)

func Init(dsn string) error {
	db, err := sqlx.Connect("postgres", dsn)
	if err != nil {
		return fmt.Errorf("connect error: %w", err)
	}
	sqlxdb = db
	return nil
}

func NamedQuery(query string, arg interface{}) (*sqlx.Rows, error) {
	return sqlxdb.NamedQuery(query, arg)
}

func NamedExec(query string, arg interface{}) (sql.Result, error) {
	return sqlxdb.NamedExec(query, arg)
}

func QueryRow(query string, args ...any) *sql.Row {
	return sqlxdb.QueryRow(query, args...)
}

func Select(dest interface{}, query string, args ...interface{}) error {
	return sqlxdb.Select(dest, query, args...)
}

func ExecContext(ctx context.Context, query string, args ...any) (sql.Result, error) {
	return sqlxdb.ExecContext(ctx, query, args...)
}
