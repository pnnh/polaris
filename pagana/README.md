# pagana — 数据库结构与数据备份

希波万象资源管理平台的 PostgreSQL 数据库 DDL 定义及数据备份仓库，提供完整的表结构创建脚本与数据导入/导出工具。

## 功能概览

- 存储平台所有表的 DDL 定义（`exported_schemas/`）
- 提供数据导出脚本（`export_tables.bash`）和导入脚本（`import_tables.py`）
- 内置 Docker 镜像，可在容器启动时自动初始化数据库

## 数据库表结构

所有表结构位于 `exported_schemas/` 目录，以 `pg_dump` 格式备份：

| 文件 | 表名 | 说明 |
|---|---|---|
| `public_accounts.sql` | `accounts` | 用户账户 |
| `public_sessions.sql` | `sessions` | 登录会话 |
| `public_articles.sql` | `articles` | 文章内容 |
| `public_channels.sql` | `channels` | 内容频道 |
| `public_notes.sql` | `notes` | 笔记 |
| `public_notebooks.sql` | `notebooks` | 笔记本 |
| `public_images.sql` | `images` | 图片 |
| `public_files.sql` | `files` | 文件 |
| `public_comments.sql` | `comments` | 评论 |
| `public_viewers.sql` | `viewers` | 浏览记录 |
| `public_libraries.sql` | `libraries` | 内容库 |
| `public_links.sql` | `links` | 链接 |
| `public_photos.sql` | `photos` | 照片 |
| `public_permissions.sql` | `permissions` | 权限 |
| `public_roles.sql` | `roles` | 角色 |
| `public_users.sql` | `users` | 用户扩展信息 |
| `public_applications.sql` | `applications` | 应用 |
| `public_clients.sql` | `clients` | OAuth 客户端 |
| `public_services.sql` | `services` | 服务注册 |
| `public_tools.sql` | `tools` | 工具 |
| `public_pipelines.sql` | `pipelines` | 流水线 |
| `public_projects.sql` | `projects` | 项目 |
| `public_repositories.sql` | `repositories` | 仓库 |
| `public_repo_files.sql` | `repo_files` | 仓库文件 |
| `public_repo_sync.sql` | `repo_sync` | 仓库同步记录 |
| `public_environments.sql` | `environments` | 环境配置 |
| `public_configuration.sql` | `configuration` | 平台配置 |
| `public_translation.sql` | `translation` | 翻译/国际化 |
| `public_chantrans.sql` | `chantrans` | 频道翻译 |
| `public_captcha.sql` | `captcha` | 验证码 |
| `public_access_code.sql` | `access_code` | 访问码 |
| `public_access_token.sql` | `access_token` | 访问令牌 |
| `personal_files.sql` | `personal_files` | 个人文件（private schema） |

自定义补充脚本位于 `custom/article.sql`。

## 使用方式

### 导出数据

```bash
bash export_tables.bash
```

脚本会通过 `pg_dump` 将各表结构及数据导出至 `exported_schemas/` 目录。

### 导入数据

```bash
python import_tables.py [选项]
```

详细用法请参阅 [docs/IMPORT_USAGE.md](docs/IMPORT_USAGE.md)。

### 初始化容器数据库

Docker 镜像基于官方 PostgreSQL 镜像，启动时自动执行 `init.sh` 导入全部表结构：

```bash
# 构建镜像
docker build --progress=plain -t pagana .

# 运行（用于本地开发或测试环境）
docker run \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=123456 \
  -e POSTGRES_DB=portal \
  -p 5432:5432 \
  pagana
```

## 工具

`tools/` 目录包含辅助脚本：

| 文件 | 用途 |
|---|---|
| `check_pg_compatibility.py` | 检查 PostgreSQL 版本兼容性 |
| `test_binary_handling.py` | 测试二进制数据处理 |
| `test_version_detection.py` | 测试版本检测功能 |

## 文档

| 文件 | 说明 |
|---|---|
| [docs/IMPORT_USAGE.md](docs/IMPORT_USAGE.md) | 数据导入详细说明 |
| [docs/BINARY_DATA_HANDLING.md](docs/BINARY_DATA_HANDLING.md) | 二进制数据处理说明 |
| [docs/VERSION_COMPATIBILITY.md](docs/VERSION_COMPATIBILITY.md) | PostgreSQL 版本兼容说明 |
| [docs/TOOLS_GUIDE.md](docs/TOOLS_GUIDE.md) | 工具使用指南 |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | 变更日志 |

## 环境要求

| 组件 | 版本 |
|---|---|
| PostgreSQL | 14+ |
| Python | 3.8+ |
| Docker | 24+（可选） |

