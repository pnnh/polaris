#!/bin/bash

set -e

echo "开始执行 SQL 文件"

# 数据库连接信息
DB_NAME="portal"
DB_USER="postgres"

# 先创建所需的扩展和 schema
psql -U "$DB_USER" -d "$DB_NAME" <<'SETUP_SQL'
CREATE EXTENSION IF NOT EXISTS ltree;
CREATE SCHEMA IF NOT EXISTS personal;
SETUP_SQL

# 导入 exported_schemas 目录下的所有 SQL 文件
# 使用 grep -v 去除 PostgreSQL 18 的 \restrict 元命令和 transaction_timeout（不兼容 PostgreSQL 16）
for sql_file in /app/exported_schemas/*.sql; do
    echo "导入: $(basename "$sql_file")"
    grep -v '^\\\\' "$sql_file" | grep -v 'SET transaction_timeout' | psql -U "$DB_USER" -d "$DB_NAME" --single-transaction -q
done

# 导入自定义 SQL 文件
for sql_file in /app/custom/*.sql; do
    echo "导入自定义: $(basename "$sql_file")"
    psql -U "$DB_USER" -d "$DB_NAME" -f "$sql_file"
done

echo "所有 SQL 文件执行完成"