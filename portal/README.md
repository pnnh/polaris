# portal — 公共接口与认证服务

希波万象资源管理平台的公共 API 服务，负责账户注册/登录/登出、JWT 签发、内容公开查询（频道、笔记、图片等）及云端文件管理。

## 功能概览

| 模块 | 路径 | 描述 |
|---|---|---|
| 认证 | `business/account/` | 注册、登录、登出、会话、邮件验证 |
| WebAuthn | `handlers/webauthn.go` | 无密码硬件密钥认证 |
| 频道 | `business/channels/` | 频道查询与控制台管理 |
| 笔记 | `business/notes/` | 笔记资产读取与社区展示 |
| 图片 | `business/images/` | 图片上传及查询 |
| 评论 | `business/comments/` | 评论读写 |
| 观看记录 | `business/viewers/` | 内容浏览记录 |
| 文件 | `cloud/files/` | 云端文件存取（PostgreSQL 存储） |
| 同步器 | `syncer/` | 文章资产同步任务 |
| 工作进程 | `worker/` | 后台异步任务 |

详细 API 列表请参阅 [docs/api.md](docs/api.md)。

## 技术栈

| 组件 | 版本 | 用途 |
|---|---|---|
| Go | 1.24+ | 运行时 |
| Gin | v1.11 | HTTP 框架 |
| sqlx + lib/pq | — | PostgreSQL 访问 |
| go-redis/v9 | v9 | Redis 缓存 |
| golang-jwt/jwt | v5 | JWT 鉴权 |
| go-webauthn/webauthn | v0.15 | WebAuthn 支持 |
| dongle | v1.2 | 加密工具 |
| quic-go | v0.58 | QUIC 协议支持 |
| logrus | v1.9 | 日志 |
| go-playground/validator | v10 | 参数校验 |

## 运行模式

服务支持通过 `--svcrole` 参数切换运行模式：

| 模式 | 说明 |
|---|---|
| `portal`（默认）| 启动 HTTP API 服务器 |
| `worker` | 后台任务进程 |
| `syncer` | 文章/资产同步进程 |

## 配置

服务通过 `--config` 参数指定配置文件，支持本地文件（`file://`）和环境变量引用（`env://CONFIG`）两种方式。

配置示例见 `config/host.yml`，主要字段：

```yaml
PUBLIC_PORTAL_URL: "https://example.com/portal"
INTERNAL_PORTAL_URL: "http://127.0.0.1:8001/portal"
DATABASE: "host=127.0.0.1 user=postgres password=... dbname=portal port=5432 sslmode=disable"
SERVE_MODE: "SELFHOST"
JWT_PRIVATE_KEY: |
  ...
JWT_PUBLIC_KEY: |
  ...
```

## 开发

```shell
# 更新依赖
go get -u

# 整理依赖
go mod tidy

# 本地运行
go run . --config file://config/host.yml

# 启动同步进程
go run . --svcrole syncer --config file://config/host.yml
```

## 构建 Docker 镜像

```bash
# 构建镜像
docker build --progress=plain -t portal .

# 运行容器
docker run -e CONFIG=env://HOST_CONFIG -p 8001:8001 portal
```

## 目录结构

```
portal/
├── main.go              # 入口，模式分发
├── server.go            # HTTP 服务器初始化与路由注册
├── business/            # 业务逻辑
│   ├── account/         # 账户认证（注册/登录/会话）
│   ├── channels/        # 频道
│   ├── notes/           # 笔记
│   ├── images/          # 图片
│   ├── comments/        # 评论
│   ├── viewers/         # 浏览记录
│   └── cloudflare/      # Cloudflare Turnstile 验证
├── cloud/files/         # 云端文件管理
├── handlers/            # 通用处理器（健康检查、WebAuthn）
├── models/              # 数据模型
├── services/            # 工具服务（JSON、哈希、Git、文件系统）
├── syncer/              # 同步任务
├── worker/              # 后台任务
└── config/              # 配置示例
```

