#!/bin/bash

# 导出 PostgreSQL 数据库中所有用户表的结构和数据
# 适用于版本控制和备份，支持 plain 和 custom 格式
# 使用前请配置数据库连接参数和输出格式
# 仅支持导出用户表，系统表会被自动过滤掉

# ========= 配置区域 =========
DBNAME="portal"
USER="postgres"
# PASS: 如果需要无密码执行，请使用 ~/.pgpass 文件，或者在命令中加 -w
OUTPUT_DIR="./exported_schemas"
# FORMAT: plain (文本) | custom (二进制,支持压缩) | directory (目录格式)
# 推荐: plain 适合版本控制, custom 适合大型数据和二进制内容
EXPORT_FORMAT="plain"
# ===========================

# 创建输出目录
mkdir -p $OUTPUT_DIR

echo "正在连接数据库 $DBNAME 获取表列表..."

# 使用 psql 查询所有用户表 (Schema + 表名)
# -F $'\t' : 指定输出分隔符为制表符 (Tab)，避免表名含空格时解析错乱
# -t -A : 纯文本、无头输出
psql -h localhost -U $USER -d $DBNAME -t -A -F $'\t' \
  -c "SELECT schemaname, tablename FROM pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema');" | \
while IFS=$'\t' read -r schema table_name; do
  
  # 跳过可能的空行
  if [[ -z "$schema" || -z "$table_name" ]]; then
    continue
  fi

  # --- 文件命名与路径处理 ---
  # 1. 直接用下划线连接 Schema 和表名，防止文件名冲突
  #    例如: public.users -> public_users.sql/.dump
  if [[ "$EXPORT_FORMAT" == "custom" ]]; then
    safe_filename="${schema}_${table_name}.dump"
  else
    safe_filename="${schema}_${table_name}.sql"
  fi
  output_file="$OUTPUT_DIR/$safe_filename"

  # 2. 构造带引号的表引用，防止 Schema 或表名是关键字 (如 "public"."order")
  #    这里使用双引号包围，PostgreSQL 会区分大小写和关键字
  quoted_table="${schema}.${table_name}"

  echo "=> 正在导出: $quoted_table"
  echo "   输出文件: $output_file"

  # --- 执行导出 ---
  # 注意: -t 参数后面跟的是 "schema"."table"
  # Format: plain=文本SQL, custom=二进制压缩(更适合大数据和二进制字段)
  # 版本兼容性选项：
  #   --no-owner: 不导出对象所有者，避免不同环境用户名差异
  #   --no-privileges: 不导出权限，避免权限系统版本差异
  #   --quote-all-identifiers: 引用所有标识符，确保关键字兼容性
  pg_dump -h localhost -U $USER -d $DBNAME \
    --format=$EXPORT_FORMAT \
    --encoding=UTF8 \
    --no-owner \
    --no-privileges \
    --quote-all-identifiers \
    -t "$quoted_table" > "$output_file"

  # 检查上一步是否成功
  if [ $? -ne 0 ]; then
    echo "   [错误] 导出表 $quoted_table 失败！"
  fi

done

echo "--------------------------------------------------"
echo "所有用户表导出完成！文件保存在: $OUTPUT_DIR"