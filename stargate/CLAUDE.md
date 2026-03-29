# stargate — 需登录的个人/社区/管理 API 服务

希波万象平台的 .NET 8 后端服务，提供需要登录才能访问的个人笔记、社区文章、文件管理等接口。认证通过委托给 portal 服务完成。

## 技术栈

- **框架**: ASP.NET Core 8.0（Web API）
- **语言**: C# (.NET 8)
- **数据库**: PostgreSQL + Entity Framework Core 8（EF Core）+ 原始 SQL
- **认证**: 自定义 OAuth2 处理器（委托给 portal 服务验证）
- **缓存**: Redis（StackExchange.Redis）
- **对象映射**: AutoMapper v14
- **文档**: Swagger/OpenAPI
- **运行端口**: 8101

## 解决方案结构

```
Polaris.sln
├── polaris/                    # ASP.NET Core Web 项目（入口）
│   ├── Program.cs              # DI 配置、中间件注册、区域路由
│   ├── Controllers/            # 根级控制器
│   │   └── AccountController.cs  # 账户（获取会话/用户信息）
│   └── Areas/                  # 区域化路由
│       ├── Community/          # /stargate/community/* 路由
│       │   └── Controllers/
│       │       ├── ArticlesController.cs   # 社区文章 CRUD
│       │       ├── ChannelsController.cs   # 社区频道
│       │       ├── FilesController.cs      # 社区文件
│       │       └── ImagesController.cs     # 社区图片
│       ├── Personal/           # /stargate/personal/* 路由
│       │   └── Controllers/
│       │       ├── NotesController.cs      # 个人笔记 CRUD
│       │       ├── FilesController.cs      # 个人文件
│       │       └── ImagesController.cs     # 个人图片
│       └── Management/         # /stargate/management/* 路由
│           └── Controllers/
│               └── ArticlesController.cs   # 管理文章
│
└── Polaris.Business/           # 业务逻辑类库
    ├── Models/                 # EF Core 实体 + 数据模型
    │   ├── DatabaseContext.cs  # DbContext + 连接工厂（IDatabaseContextFactory）
    │   ├── Community/          # CmArticleModel、CmChannelModel 等
    │   ├── Personal/           # PsNoteModel、PsFileModel 等
    │   ├── Public/             # DeAccountModel（账户）
    │   └── Protocol/           # 统一响应协议（Result、Codes）
    ├── Services/               # 业务服务
    │   ├── Authentication.cs   # OAuth2 认证处理器
    │   ├── Account.cs          # 账户服务
    │   └── Article.cs          # 文章服务
    └── Helpers/
        ├── DataContextHelper.cs  # 原始 SQL 执行工具
        └── MapperHelper.cs       # AutoMapper 工具
```

## API 路由

### 账户（无需鉴权）
```
GET /account/session          返回当前会话信息（未登录返回匿名）
GET /account/information      返回当前账户信息（未登录返回匿名）
```

### 社区模块（需登录）
```
GET    /stargate/community/articles              文章列表（支持分页/搜索/排序/筛选）
GET    /stargate/community/articles/{uid}        文章详情
POST   /stargate/community/articles              创建文章
PUT    /stargate/community/articles/{uid}        更新文章
DELETE /stargate/community/articles/{uid}        删除文章
POST   /stargate/community/articles/batch        批量创建
POST   /stargate/community/articles/{uid}/sync   从笔记同步到文章
```

### 个人模块（需登录）
```
GET    /stargate/personal/notes              笔记列表
GET    /stargate/personal/notes/{uid}        笔记详情
POST   /stargate/personal/notes              创建笔记
PUT    /stargate/personal/notes/{uid}        更新笔记
POST   /stargate/personal/notes/{uid}        删除笔记（用 POST 模拟）
```

## 认证机制

### 认证流程（委托给 portal）
1. 从请求 Cookie（字段 `PT`）或 Header（`Portal-Authorization`）提取 Token
2. 调用 `INTERNAL_PORTAL_URL/account/auth/userinfo` 向 portal 验证 Token
3. Portal 返回用户信息（Username），创建 `ClaimsPrincipal`

### 使用方式
- 受保护接口添加 `[Authorize]` 特性
- 控制器通过 `HttpContext.User` 获取当前用户

## 数据库访问

### EF Core（推荐）
```csharp
// 简单 CRUD
var note = await databaseContext.Notes
    .FirstOrDefaultAsync(o => o.Uid == uid && o.Owner == account.Uid);
await databaseContext.Notes.AddAsync(note);
await databaseContext.SaveChangesAsync();
```

### 原始 SQL（复杂查询）
```csharp
// DatabaseContextHelper.RawSqlQuery<T>() — 查询
var models = DatabaseContextHelper.RawSqlQuery<CmArticleModel>(
    databaseContext, sqlText, parameters);

// DatabaseContextHelper.RawSqlScalar<T>() — 标量查询
var count = DatabaseContextHelper.RawSqlScalar<int>(databaseContext, countSql, parameters);
```

### DbSet 映射
| DbSet | 数据库表 |
|-------|---------|
| `Notes` | `personal.notes` |
| `Articles` | `community.articles` |
| `CommunityFiles` | `community.files` |
| `CommunityImages` | `community.images` |
| `Accounts` | `public.accounts` |
| `Channels` | `community.channels` |

**注意**：DateTime 字段统一转换为 UTC 存储（`TimestampTz` 类型）。

## 统一响应协议

```json
// 成功（列表）
{ "code": 200, "data": { "page": 1, "size": 10, "range": [...], "count": 100 } }

// 成功（单条）
{ "code": 200, "data": { ... } }

// 错误
{ "code": 400, "message": "错误信息" }
```

状态码：`200 Ok`、`400 BadRequest`、`404 NotFound`、`401 Unauthorized`、`500 Error`

## 查询参数约定

```csharp
var queryHelper = new MQueryHelper(Request.Query);
var keyword = queryHelper.GetString("keyword");  // 模糊搜索
var page = queryHelper.GetInt("page") ?? 1;
var size = queryHelper.GetInt("size") ?? 10;
var sort = queryHelper.GetString("sort") ?? "latest";  // latest | read
var filter = queryHelper.GetString("filter") ?? "all"; // all | month | year
```

## 配置参数

| 参数 | 说明 |
|------|------|
| `ConnectionString` | PostgreSQL 连接串（Server=...;Port=...;Database=...;User Id=...;Password=...;） |
| `INTERNAL_PORTAL_URL` | Portal 服务内部地址（用于验证 Token） |
| `ASPNETCORE_ENVIRONMENT` | `Development` 或 `Production` |

监听地址：`http://0.0.0.0:8101`（`appsettings.json` 中配置）

## JSON 序列化约定

所有 JSON 字段名使用**蛇形命名（snake_case_lower）**：
```csharp
options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower;
```

## 编译与运行

```bash
dotnet build                                          # 编译
dotnet run --project polaris/                         # 启动
docker build --progress=plain -t stargate .           # 构建镜像
```
