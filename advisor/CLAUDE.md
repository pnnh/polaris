# advisor — 内容处理后台服务

希波万象平台的 Python 后台作业服务，负责将 Markdown 文章转换为安全的 HTML，支持 HTTP 触发和 Redis 消息队列两种工作模式。

## 技术栈

- **框架**: FastAPI + Uvicorn（ASGI）
- **语言**: Python 3.13+
- **包管理**: uv
- **数据库**: PostgreSQL + SQLAlchemy 2.0（async）+ asyncpg
- **消息队列**: Redis Streams（Consumer Group）
- **内容处理**: pypandoc（Markdown→HTML）+ nh3（HTML 净化）+ tinycss2（CSS 净化）
- **实验性**: OpenAI SDK（连接 Hugging Face，Gemma 模型，未集成到主服务）
- **运行端口**: 8000

## 常用命令

```bash
uv sync                          # 安装依赖
uv run uvicorn main:app --reload  # 启动开发服务器
uv run python -m pytest          # 运行测试（如有）
```

## 目录结构

```
advisor/
├── main.py             # FastAPI 应用入口：路由定义、lifespan、后台任务启动
├── db.py               # SQLAlchemy 异步引擎初始化和 Session 工厂
├── pyproject.toml      # 项目配置和依赖声明
├── uv.lock             # 锁定依赖版本
├── config/
│   └── config.yaml     # 数据库、Redis、批处理参数配置
├── models/
│   └── article.py      # SQLAlchemy ORM 模型（Article，映射 community.articles）
├── schemas/
│   └── article.py      # Pydantic 请求/响应 Schema（ArticleSchema）
└── genai/
    └── gemma.py        # 实验性 GenAI 示例（Hugging Face Gemma 3，未集成）
```

## API 接口

```
GET  /                          健康检查（返回 {"message": "Hello World"}）
GET  /hello/{name}              问候（测试用）
GET  /articles/{uid}            获取文章（含转换后的 HTML content 字段）
POST /articles/{uid}/render     手动触发单篇文章 Markdown→HTML 转换
POST /articles/batch-render     手动触发批量文章转换任务
```

## 核心工作流程：Markdown → HTML 转换

```
1. 从 community.articles 查询文章（uid）
2. 验证 mimetype == "text/markdown"
3. pypandoc 将 body 字段（Markdown）转为独立 HTML（--standalone）
4. 分离 <body> 内容（content）和 <style> 块（styles）
5. nh3 净化 HTML（白名单标签/属性，防 XSS）
6. tinycss2 净化 CSS（阻止 @import、拦截 javascript:/expression() 等注入）
7. 保存到数据库：content（净化 HTML）、styles（净化 CSS）、convert_time
```

### 触发条件
- 待转换条件：`mimetype = 'text/markdown'` 且 `convert_time IS NULL OR convert_time < update_time`

## 后台任务（应用启动时自动运行）

### Redis 流消费者（`_stream_consumer`）
- 监听 Redis Stream：`article:render`（Consumer Group：`advisor`）
- 消息格式：`XADD article:render * uid <uuid>`
- 每次拉取 10 条，等待最长 5 秒
- ACK 机制：永久失败（不存在/类型不符）立即 ACK；临时失败不 ACK，重启后重处理

### 批量定时转换（`_batch_converter_task`）
- 每隔 `batch_convert.interval` 秒（默认 300s）扫描一次
- 每次处理最多 `batch_convert.limit` 篇（默认 100）
- 可通过配置文件动态开关（`batch_convert.enabled`），无需重启服务

## 配置文件（`config/config.yaml`）

```yaml
database:
  dsn: "postgresql+asyncpg://postgres:123@localhost:5432/portal"

redis:
  url: "redis://localhost:6379"
  stream: "article:render"    # Redis 流名称
  group: "advisor"            # 消费者组
  consumer: "advisor-1"       # 消费者实例名称

batch_convert:
  enabled: true               # 是否启用批量定时转换
  interval: 300               # 扫描间隔（秒）
  limit: 100                  # 每次最多处理篇数
```

## 数据库模型

**表**：`community.articles`（与 portal 和 stargate 共用同一数据库）

| 字段 | 类型 | 说明 |
|------|------|------|
| `uid` | UUID（PK） | 主键 |
| `body` | Text | Markdown 原始内容（输入） |
| `content` | Text | 转换后的净化 HTML（输出） |
| `styles` | Text | 提取的净化 CSS（输出） |
| `mimetype` | String | 内容类型（`text/markdown` 表示需要转换） |
| `convert_time` | DateTime | 最后转换时间 |
| `update_time` | DateTime | 最后更新时间 |

## 应用启动流程（lifespan）

```
启动 → init_engine()（初始化 SQLAlchemy 异步引擎）
     → 启动 _stream_consumer（Redis 消费者）后台任务
     → 启动 _batch_converter_task（批量转换）后台任务
     → 处理 HTTP 请求 / Redis 消息 / 定时批处理
关闭 → 取消所有后台任务 → dispose_engine()
```

## 安全设计

- **HTML 净化**（nh3）：白名单标签、扩展 class 属性支持（代码高亮）、自定义属性过滤
- **CSS 净化**（tinycss2）：阻止 `@import`/`@charset`/`@namespace`、拦截 `javascript:`/`expression()`/`behavior:`/-`moz-binding`
- **class 属性校验**：仅允许 `[a-zA-Z0-9_-]` 字符，防止 class 注入

## 重要约定

- **不要修改 `genai/gemma.py`**：这是实验性示例代码，与主服务完全独立
- 数据库 Session 通过 FastAPI 依赖注入（`Depends(get_session)`）获取
- 后台任务使用 `get_session_factory()` 直接管理 Session 生命周期
- 配置文件支持热重载（后台任务每次循环重新读取），无需重启生效
- 与 portal 共用同一个 PostgreSQL 数据库（`community.articles` 表）
