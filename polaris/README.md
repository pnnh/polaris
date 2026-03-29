# polaris — 浏览器端前端网站

希波万象资源管理平台的浏览器端应用，基于 Next.js 构建，提供内容浏览、账户管理、个人控制台和社区功能等完整用户界面。

## 功能概览

| 页面模块  | 路径                  | 描述           |
|-------|---------------------|--------------|
| 首页    | `/`                 | 平台主页         |
| 文章    | `/[lang]/articles`  | 文章列表与详情      |
| 频道    | `/[lang]/channels`  | 频道浏览         |
| 图片    | `/[lang]/images`    | 图片浏览         |
| 搜索    | `/[lang]/search`    | 全文搜索         |
| 社区    | `/[lang]/community` | 社区内容与频道      |
| 个人控制台 | `/[lang]/console`   | 文件、文件、个人信息管理 |
| 账户    | `/[lang]/account`   | 登录、注册、用户设置   |
| 工具箱   | `/[lang]/tools`     | 辅助工具页面       |

详细页面与组件说明请参阅 [docs/pages.md](docs/pages.md)。

## 技术栈

### 核心框架

| 组件         | 版本   | 用途         |
|------------|------|------------|
| Next.js    | 16.x | SSR/SSG 框架 |
| React      | 19.x | UI 库       |
| TypeScript | 5.x  | 类型系统       |
| Vite       | —    | 客户端构建工具    |

### UI 组件与样式

| 组件                | 版本   | 用途             |
|-------------------|------|----------------|
| MUI (Material UI) | 7.x  | 基础组件库          |
| Emotion           | 11.x | CSS-in-JS      |
| Panda CSS         | 1.x  | 原子化 CSS 生成     |
| TailwindCSS       | 4.x  | 工具类 CSS        |
| DaisyUI           | 5.x  | TailwindCSS 组件 |
| HugeIcons         | 3.x  | 图标库            |

### 状态管理与数据

| 组件               | 版本  | 用途                |
|------------------|-----|-------------------|
| Jotai            | 2.x | 原子化状态管理           |
| SWR              | 2.x | 数据请求与缓存           |
| idb / idb-keyval | 8.x | IndexedDB 本地存储    |
| SQLite Wasm      | 3.x | 浏览器端 SQLite       |
| pg / pg-promise  | 8.x | 服务端 PostgreSQL 访问 |

### 编辑器与内容

| 组件                        | 版本      | 用途          |
|---------------------------|---------|-------------|
| Slate.js                  | 0.118.x | 富文本编辑器      |
| Marked + marked-highlight | 17.x    | Markdown 渲染 |
| Prism.js                  | 1.29    | 代码高亮        |
| DOMPurify                 | 3.x     | HTML 安全净化   |

### 工具库

| 组件                 | 用途        |
|--------------------|-----------|
| FingerprintJS      | 浏览器设备指纹   |
| crypto-js          | 客户端加密     |
| jsbarcode / qrcode | 条形码/二维码生成 |
| moment             | 日期处理      |
| lodash             | 工具函数      |
| node-cron          | 服务端定时任务   |

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器（Next.js，端口 7100）
npm run next

# 启动 Vite 客户端构建（watch 模式）
npm run dev

# 生成 Panda CSS（watch 模式）
npm run panda

# 完整生产构建
npm run build
```

## 测试

```bash
# 运行单元测试（Vitest）
npm run test

# 分析产物包体积
npm run analyze
```

## 构建 Docker 镜像

```bash
# 构建镜像
docker build --progress=plain -t polaris .

# 打标签并推送
docker tag polaris your-registry/polaris:v0.x.x
docker login
docker push your-registry/polaris:v0.x.x
```

## 环境配置

服务端运行时配置位于 `config/host.env`，主要字段：

| 变量                      | 说明              |
|-------------------------|-----------------|
| `INTERNAL_PORTAL_URL`   | portal 服务内部地址   |
| `PUBLIC_PORTAL_URL`     | portal 服务公开地址   |
| `INTERNAL_STARGATE_URL` | stargate 服务内部地址 |

## 国际化

前端使用 Next.js 的动态路由段 `[lang]` 实现多语言支持，语言参数通过 `accept-language` 请求头自动解析。

## 目录结构

```
polaris/src/
├── app/                  # Next.js App Router 页面
│   ├── [lang]/           # 国际化路由
│   │   ├── articles/     # 文章页面
│   │   ├── channels/     # 频道页面
│   │   ├── community/    # 社区页面
│   │   ├── console/      # 个人控制台
│   │   ├── images/       # 图片页面
│   │   ├── account/      # 账户页面
│   │   ├── search/       # 搜索页面
│   │   └── tools/        # 工具页面
│   ├── @header/          # 布局插槽：顶栏
│   └── @footer/          # 布局插槽：底栏
├── components/           # 公共 UI 组件
├── services/             # API 调用与业务逻辑
├── photon/               # 文件公用业务逻辑
├── gen/                  # Panda CSS 生成代码
├── types/                # TypeScript 类型定义
├── utils/                # 工具函数
└── proxy.ts              # 服务端代理配置
```

