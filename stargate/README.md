# stargate — 控制台后端接口服务

希波万象资源管理平台中需要登录才能访问的后端 API 服务，提供个人控制台、社区管理及内容管理所需的受保护接口。

## 功能概览

| 模块 | 路径前缀 | 描述 |
|---|---|---|
| 账户 | `/account/` | 会话信息、用户资料查询 |
| 频道 | `/channels/` | 频道内容读取 |
| 社区文章 | `/community/articles/` | 社区文章的公开展示 |
| 社区频道 | `/community/channels/` | 社区频道公开接口 |
| 文件 | `/files/` | 文件上传与管理（需登录） |
| 图片 | `/images/` | 图片管理（需登录） |
| 笔记 | `/notes/` | 笔记 CRUD（需登录） |
| 观看记录 | `/viewers/` | 内容浏览统计（需登录） |
| 控制台笔记 | `/stargate/console/notes` | 个人控制台笔记管理（需登录） |

## 技术栈

| 组件 | 版本 | 用途 |
|---|---|---|
| .NET | 8.0 | 运行时 |
| ASP.NET Core | 8.0 | Web 框架 |
| Entity Framework Core | 8.0 | ORM |
| Npgsql EF Core PostgreSQL | 8.0 | PostgreSQL 驱动 |
| StackExchange.Redis | 2.7 | Redis 缓存 |
| AutoMapper | 14.0 | 对象映射 |
| Markdig | 0.33 | Markdown 渲染 |
| JWT Bearer | 8.0 | JWT 鉴权 |
| Swashbuckle (Swagger) | 6.5 | API 文档 |
| Molecule | 0.5 | 内部公共库 |

## 认证机制

stargate 使用自定义 `OAuth2AuthenticationHandler`，通过调用 portal 的内部接口验证请求中携带的 JWT Token，实现认证委托。请求需在 Header 中携带：

```
Portal-Authorization: <JWT Token>
```

## 配置

通过环境变量或 `appsettings.json` 进行配置：

| 环境变量 | 说明 |
|---|---|
| `ConnectionString` | PostgreSQL 连接字符串 |
| `INTERNAL_PORTAL_URL` | portal 服务内部地址（用于 Token 验证） |
| `ASPNETCORE_ENVIRONMENT` | 运行环境（`Development` / `Production`） |

配置示例（`appsettings.json`）：

```json
{
  "ConnectionString": "Server=localhost;Port=5432;Database=portal;User Id=postgres;Password=...;",
  "INTERNAL_PORTAL_URL": "http://127.0.0.1:8001/portal"
}
```

## 开发

```bash
# 进入项目目录
cd polaris

# 还原依赖
dotnet restore

# 本地运行
dotnet run

# 发布
dotnet publish -c Release
```

## 构建 Docker 镜像

```bash
# 构建镜像
docker build --progress=plain -t stargate .

# 运行容器
docker run \
  -e ConnectionString="Server=postgres;Port=5432;Database=portal;User Id=postgres;Password=123456;" \
  -e INTERNAL_PORTAL_URL="http://portal:8001/portal" \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -p 8101:8101 \
  stargate
```

## 目录结构

```
stargate/
├── polaris/                  # ASP.NET Core Web 项目
│   ├── Program.cs            # 应用入口与服务注册
│   ├── Controllers/          # API 控制器
│   │   ├── AccountController.cs
│   │   ├── ChannelsController.cs
│   │   ├── CommunityArticlesController.cs
│   │   ├── CommunityChannelsController.cs
│   │   ├── FilesController.cs
│   │   ├── ImagesController.cs
│   │   ├── NotesController.cs
│   │   └── ViewersController.cs
│   └── Properties/           # 启动配置
└── Polaris.Business/         # 业务逻辑类库
    ├── Models/               # 数据模型（EF Core 实体 & DTO）
    │   ├── DatabaseContext.cs
    │   ├── Polaris/          # 业务实体（文章、频道、笔记等）
    │   ├── Public/           # 账户模型
    │   └── Protocol/         # 通用响应协议（Result、Codes）
    ├── Services/             # 业务服务层
    │   ├── Account.cs
    │   ├── Article.cs
    │   ├── Authentication.cs
    │   └── Model.cs
    └── Helpers/              # 工具类（AutoMapper、DataContext 等）
```
