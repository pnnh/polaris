# pagana — PostgreSQL 数据库 DDL 及数据管理

希波万象平台的 PostgreSQL 数据库仓库，提供完整的表结构定义（DDL）、数据导入导出工具，以及 Docker 容器化初始化方案。

## 技术栈

- **数据库**: PostgreSQL 16+（生产使用 16，导出测试使用 18）
- **扩展**: `ltree`（树形路径结构）
- **工具**: Python 3 + Bash + pg_dump/psql
- **Docker**: 基于 `postgres:16` 镜像

## 数据库结构

### 三个 Schema

| Schema | 功能 |
|--------|------|
| `public` | 用户账户、会话、公共内容（文章/频道/图片/文件/评论）、权限/角色 |
| `personal` | 个人隔离数据（文件、图片、笔记、笔记本、库） |
| `community` | 社区数据（文章、频道、文件、图片、评论、权限、角色） |

### 主要表分类（共 48 张表）

**认证与会话**（public）：`accounts`、`sessions`、`users`、`access_token`、`clients`

**内容管理**（public/community）：`articles`、`channels`、`files`、`images`、`comments`、`notes`、`notebooks`

**个人数据**（personal）：`personal_files`（含 ltree path）、`personal_images`、`personal_notes`、`personal_notebooks`

**权限系统**：`permissions`、`roles`、`viewers`

**资源管理**：`repositories`、`repo_files`、`pipelines`、`projects`

## 目录结构

```
pagana/
├── exported_schemas/       # 导出的 SQL 文件（每张表一个文件）
│   ├── public_accounts.sql
│   ├── community_articles.sql
│   ├── personal_files.sql
│   └── ... (共 48 个)
├── custom/                 # 自定义初始化数据
│   └── article.sql         # 示例文章数据（2 条）
├── tools/                  # 辅助工具脚本
│   ├── check_pg_compatibility.py    # 版本兼容性检查
│   ├── test_binary_handling.py      # 二进制数据处理测试
│   └── test_version_detection.py   # 版本检测测试
├── docs/                   # 详细文档
│   ├── IMPORT_USAGE.md
│   ├── EXPORT_USAGE.md
│   ├── BINARY_DATA_HANDLING.md
│   ├── VERSION_COMPATIBILITY.md
│   └── TOOLS_GUIDE.md
├── init.sh                 # Docker 初始化脚本（容器启动时执行）
├── export_tables.bash      # 导出表结构和数据到 exported_schemas/
├── import_tables.py        # 从 exported_schemas/ 导入表结构和数据
└── Dockerfile              # Docker 镜像构建
```

## 常用命令

### Docker 启动数据库
```bash
docker build --progress=plain -t pagana .
docker run \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=123456 \
  -e POSTGRES_DB=portal \
  -p 5432:5432 \
  pagana
```

### 导出表结构和数据
```bash
bash export_tables.bash
# 输出到 exported_schemas/，每张表一个 SQL 文件
```

### 导入数据（import_tables.py）
```bash
# 分阶段导入（推荐）
python3 import_tables.py --action ddl    # 先导入表结构
python3 import_tables.py --action data   # 再导入数据

# 导入全部
python3 import_tables.py --action all -y

# 导入单张表
python3 import_tables.py --table accounts -y
```

**import_tables.py 参数**：
- `--action ddl|data|all`：操作类型（仅结构/仅数据/全部）
- `--table TABLE`：只操作指定表
- `-y`：自动确认，无需手动交互

## 初始化流程（init.sh）

Docker 容器启动时自动执行：
1. 创建 `ltree` 扩展
2. 创建 `personal` schema
3. 遍历 `exported_schemas/` 下所有 SQL 文件并执行
4. 执行 `custom/` 目录下的自定义 SQL（初始数据）

## 导出配置（export_tables.bash）

```bash
DBNAME="portal"       # 数据库名
USER="postgres"       # 用户名
OUTPUT_DIR="./exported_schemas"
EXPORT_FORMAT="plain" # plain（纯 SQL）或 custom（pg_dump 二进制格式）
```

导出选项：`--no-owner --no-privileges --quote-all-identifiers --encoding=UTF8`

## 连接参数（本地开发默认值）

```
Host: localhost
Port: 5432
Database: portal
User: postgres
Password: 123456
```

## 重要约定

- `exported_schemas/` 中的文件名格式为 `{schema}_{tablename}.sql`
- 添加新表时：在数据库中创建 → 运行 `export_tables.bash` → 提交新生成的 SQL 文件
- `personal.personal_files` 等表使用 `ltree` 类型的 `path` 字段存储目录树
- 二进制字段（`bytea`）使用十六进制转义序列存储，import 工具使用 `surrogateescape` 正确处理
- 修改表结构后，`import_tables.py --action ddl` 会显示 DDL diff，确认后再执行
