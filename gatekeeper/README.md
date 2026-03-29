# gatekeeper — 端到端集成测试

希波万象资源管理平台的端到端（E2E）测试项目，基于 [Playwright](https://playwright.dev/) 实现，覆盖首页、文章、账户等核心流程的浏览器级集成验证。

## 测试范围

| 测试文件 | 覆盖场景 |
|---|---|
| `src/tests/home.spec.ts` | 首页加载、基础导航 |
| `src/tests/article.spec.ts` | 文章列表、文章详情页 |

## 依赖环境

测试运行前，需通过 Docker Compose 启动完整服务栈（PostgreSQL、portal、stargate）：

```bash
docker compose -f docker-compose.yaml up -d
```

服务启动顺序：
1. **postgres**（pagana 镜像，含预置数据）
2. **portal**（Go 认证服务，端口 8001）
3. **stargate**（.NET API 服务，端口 8101）
4. **polaris**（前端，端口 7100）— 若需全链路测试

## 快速开始

```bash
# 安装依赖
npm install

# 安装 Playwright 浏览器
npx playwright install chromium

# 启动后端服务
docker compose -f docker-compose.yaml up -d

# 运行所有测试
npx playwright test

# 运行指定测试文件
npx playwright test src/tests/home.spec.ts

# 查看 HTML 测试报告
npx playwright show-report
```

## 技术栈

| 组件 | 版本 | 用途 |
|---|---|---|
| Playwright | 1.52+ | E2E 测试框架 |
| TypeScript | 5.x | 测试脚本语言 |
| Node.js | 20+ | 运行时 |

## 配置说明

测试配置位于 `playwright.config.ts`，主要参数：

| 参数 | 说明 |
|---|---|
| `testDir` | 测试文件目录（`.`，即项目根目录） |
| `fullyParallel` | 并行执行所有测试 |
| `reporter` | 同时输出 list、JSON、HTML 报告 |
| `projects` | 当前仅配置 Chromium |

测试服务地址通过 `config/portal.yml` 与 `config/polaris.env` 配置（对应 docker-compose 服务映射）。

## 报告

测试完成后报告输出至：

- `playwright-report/` — HTML 可视化报告
- `test-results.json` — JSON 格式结果（便于 CI 消费）

## 目录结构

```
gatekeeper/
├── playwright.config.ts   # Playwright 配置
├── docker-compose.yaml    # 本地测试环境编排
├── src/
│   ├── tests/             # 测试用例
│   │   ├── home.spec.ts
│   │   └── article.spec.ts
│   └── services/          # 测试辅助服务（页面对象等）
├── config/
│   ├── portal.yml         # portal 服务配置
│   └── polaris.env        # 前端环境变量
├── playwright-report/     # HTML 报告输出目录
└── test-results/          # 测试截图/录像输出目录
```