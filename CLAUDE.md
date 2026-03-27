# polaris — 希波万象前端

希波万象资源管理平台的 Next.js 16 前端，支持文章、笔记、频道、图片、文件等多种内容类型。

## 技术栈

- **框架**: Next.js 16 (App Router) + React 19 + TypeScript 5.9
- **样式**: Tailwind CSS v4 + DaisyUI v5 + Panda CSS + MUI v7
- **状态管理**: Jotai + SWR
- **编辑器**: Slate.js（富文本）
- **运行端口**: 7100

## 常用命令

```bash
npm run next          # 开发服务器（Turbo 模式，端口 7100）
npm run panda         # Panda CSS 代码生成（watch 模式）
npm run dev           # 客户端 Vite 构建（watch 模式）
npm run build         # 生产构建（vite build + panda codegen + next build）
npm run test          # Vitest 单元测试
npm run analyze       # 包体积分析
```

> 开发时通常需要同时运行 `npm run next` 和 `npm run panda`（Panda CSS 需要 watch 以自动生成类名）。

## 目录结构

```
src/
├── app/                    # Next.js App Router 路由
│   ├── page.tsx            # 根路由（自动重定向至 [lang]）
│   ├── layout.tsx          # 根布局（并行路由：@header、@footer）
│   ├── global.css          # 全局样式（Tailwind + DaisyUI + CSS 变量）
│   ├── @header/            # 顶栏插槽（并行路由）
│   ├── @footer/            # 底栏插槽（并行路由）
│   └── [lang]/             # 多语言动态路由
│       ├── page.tsx        # 首页（force-dynamic）
│       ├── articles/       # 文章模块
│       ├── channels/       # 频道模块
│       ├── community/      # 社区模块
│       ├── console/        # 个人控制台
│       ├── images/         # 图片模块
│       ├── account/        # 账户（登录/注册）
│       ├── search/         # 搜索
│       └── tools/          # 工具集
├── components/
│   ├── server/             # 服务端组件（async function，直接访问 DB/API）
│   │   ├── content/        # 布局相关（layout.tsx、navbar、profile）
│   │   ├── body.tsx        # 首页主体（PSHomeBody）
│   │   └── pagination.tsx  # 分页组件
│   ├── client/             # 客户端组件（'use client'，含交互逻辑）
│   └── common/             # 通用工具（language.ts、models、locales）
└── gen/styled/             # Panda CSS 自动生成代码（勿手动修改）
```

## 样式架构

### CSS 层级（global.css 中定义）
```
theme → base → mui → components → utilities
panda-reset → panda-base → panda-tokens → panda-recipes → panda-utilities
```

### 三套样式系统并存
1. **Panda CSS**（主要）：`css\`...\`` 模板字面量，需 `npm run panda` 生成类名
2. **Tailwind CSS v4 + DaisyUI v5**：直接在 `className` 中使用工具类
3. **MUI v7**：通过 `ThemeProvider` 管理，含亮/暗主题

### CSS 变量（主题相关）
```css
var(--background-color)      /* 背景色 */
var(--primary-color)         /* 主色（亮色 #1976d2，暗色 #90caf9）*/
var(--text-primary-color)    /* 主要文字色 */
var(--text-secondary-color)  /* 次要文字色 */
var(--border-color)          /* 边框色 */
var(--divider-color)         /* 分割线色 */
var(--action-hover-color)    /* hover 背景色 */
```

暗色主题通过 `body.darkTheme` 类切换。**避免在样式中使用硬编码颜色，应优先使用 CSS 变量。**

## 重要约束

### 服务端 vs 客户端组件
- `src/components/server/` 下的组件均为**服务端组件**，可以是 `async function`，可直接 `await` 调用后端 API 或数据库
- `src/components/client/` 下的组件顶部有 `'use client'`，不能直接 async 或访问服务端资源
- **不要在服务端组件中添加 `'use client'`，也不要在客户端组件中使用服务端数据获取**

### Panda CSS
- 样式用 `css\`...\`` 模板字面量编写，从 `@/gen/styled/css` 导入
- 修改样式后需要 `npm run panda` 重新生成（开发时用 watch 模式）
- `src/gen/styled/` 目录是自动生成的，不要手动修改

### 国际化路由
- 语言通过 `[lang]` 动态路由段传递（如 `/en`、`/zh`）
- 根路由 `/` 通过 `Accept-Language` 头自动检测语言
- 无效语言返回 `notFound()`

## 与其他服务的通信

| 服务 | 访问方式 | 说明 |
|------|---------|------|
| portal | `INTERNAL_PORTAL_URL`（服务端） | 公共 API 及认证，端口 8001 |
| stargate | `INTERNAL_STARGATE_URL`（服务端） | 登录后的个人/社区 API，端口 8101 |

## 路由路径别名

`@/*` → `./src/*`（在 tsconfig.json 中配置）
