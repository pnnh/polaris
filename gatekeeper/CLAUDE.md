# gatekeeper — E2E 集成测试套件

希波万象平台的端到端测试仓库，使用 Playwright 对前端（polaris）的核心功能进行集成测试，同时提供 Docker Compose 启动完整服务栈的方案。

## 技术栈

- **测试框架**: Playwright 1.52+
- **语言**: TypeScript 5.8
- **运行时**: Node.js 20+
- **浏览器**: Chromium（仅此一种）
- **CI**: Docker 容器化，支持全栈 Docker Compose 启动

## 常用命令

```bash
npm install                           # 安装依赖
npx playwright install chromium       # 安装浏览器

# 本地运行测试（需先启动完整服务栈）
npx playwright test                   # 运行所有测试
npx playwright test src/tests/home.spec.ts  # 运行单个文件
npx playwright test -g "文章列表"      # 按名称运行

npx playwright show-report            # 查看 HTML 测试报告

# Docker 环境（完整服务栈 + 自动测试）
cd gatekeeper
docker compose -f docker-compose.yaml up -d
```

## 目录结构

```
gatekeeper/
├── src/
│   ├── tests/                  # 测试用例
│   │   ├── home.spec.ts        # 首页（1 个用例）
│   │   ├── article.spec.ts     # 文章功能（11 个用例）
│   │   ├── account.spec.ts     # 账户登录/注册（12 个用例）
│   │   └── search.spec.ts      # 搜索功能（6 个用例）
│   └── services/server/
│       └── config.ts           # 读取 PUBLIC_SELF_URL 环境变量
├── config/
│   ├── polaris.env             # Polaris 前端容器环境变量
│   └── portal.yml              # Portal 服务配置（含 JWT 密钥）
├── playwright.config.ts        # Playwright 配置
├── docker-compose.yaml         # 完整服务栈编排（5 个服务）
└── Testing.Dockerfile          # 测试容器镜像
```

## 测试覆盖范围（共 30 个用例）

| 测试文件 | 功能模块 | 用例数 | 覆盖场景 |
|---------|---------|-------|---------|
| `home.spec.ts` | 首页 | 1 | 页面标题验证 |
| `article.spec.ts` | 文章 | 11 | 列表加载、详情页、排序（Latest/Read Rank）、筛选（Month/Year/All）、卡片渲染 |
| `account.spec.ts` | 账户 | 12 | 登录/注册页加载（中/英文）、表单验证、页面跳转链接 |
| `search.spec.ts` | 搜索 | 6 | 搜索页加载（中/英文）、关键词显示、结果渲染、无结果处理 |

**特点**：
- 所有测试覆盖中文（`/zh`）和英文（`/en`）两种语言路由
- 使用 `data-article` 属性定位文章卡片元素
- 验证错误提示文字、表单验证、页面导航

## Docker Compose 服务栈

```
postgres（pagana 镜像）
  ↓ 健康就绪后
portal（Go 认证服务，:8001）
  ↓ 健康就绪后
stargate（.NET API，:8101）+ polaris（前端，:8100→:7100）
  ↓ 健康就绪后
gatekeeper（Playwright 测试容器，自动运行并退出）
```

### 启动顺序与依赖
- postgres → portal → polaris（portal 健康后）
- postgres → stargate → polaris（stargate 健康后）
- polaris 健康后 → gatekeeper 开始测试

### 关键环境变量
- `PUBLIC_SELF_URL=http://polaris:7100`（测试目标 URL）
- `RUN_MODE=test`（启用重试 2 次、1 个 worker 串行执行）

## 配置文件

### `config/polaris.env`（Polaris 前端容器内使用）
```
PUBLIC_PORTAL_URL=http://polaris:7100/portal
INTERNAL_PORTAL_URL=http://portal:8001/portal
INTERNAL_STARGATE_URL=http://stargate:8101/stargate
DATABASE_URL=postgresql://postgres:123456@postgres:5432/portal
SERVE_MODE=SELFHOST
```

### `config/portal.yml`（Portal 服务配置，含 JWT 密钥）
> **注意**：该文件包含 RSA 私钥，不应提交到公共仓库。

## Playwright 配置要点（`playwright.config.ts`）

| 设置 | 开发模式 | CI/测试模式（`RUN_MODE=test`）|
|------|---------|--------------------------|
| `retries` | 0 | 2 |
| `workers` | 默认（并行） | 1（串行） |
| `forbidOnly` | false | true |

报告输出：
- `playwright-report/`（HTML 格式，地址 `http://0.0.0.0:9323`）
- `test-results.json`（JSON 格式）
- 控制台列表输出

## 本地开发测试流程

```bash
# 1. 启动完整服务栈
docker compose up -d postgres portal stargate polaris

# 2. 等待所有服务健康就绪后运行测试
npx playwright test

# 3. 查看报告
npx playwright show-report
```

## 重要约定

- 测试中通过 `useServerConfig()` 获取基础 URL（读取 `PUBLIC_SELF_URL`，默认 `http://localhost:7100`）
- 新增测试文件放在 `src/tests/` 目录，命名格式 `*.spec.ts`
- 选择器优先使用 `data-*` 属性（如 `[data-article]`），避免依赖视觉样式类名
- 国际化测试：每个功能场景都应覆盖 `/en` 和 `/zh` 两条路径
