# 页面与组件说明

## 页面结构

polaris 使用 Next.js App Router，所有用户可见页面位于 `src/app/[lang]/` 目录下，通过语言前缀实现国际化路由。

## 主要页面

### 文章（`/[lang]/articles`）

- 文章列表：支持分页浏览平台内所有公开文章
- 文章详情：Markdown 渲染正文，支持代码高亮（Prism.js），内嵌图片与附件

### 频道（`/[lang]/channels`）

- 频道列表：展示所有公开频道
- 频道详情：频道内文章/文件列表

### 图片（`/[lang]/images`）

- 图片瀑布流浏览
- 图片详情与元数据展示

### 搜索（`/[lang]/search`）

全文搜索入口，支持搜索文章、文件、频道等内容。

### 社区（`/[lang]/community`）

- 社区文章列表
- 社区频道浏览
- 内容互动（评论）

### 个人控制台（`/[lang]/console`）

需要登录后访问：

| 子页面   | 路径                  | 功能        |
|-------|---------------------|-----------|
| 控制台首页 | `/console`          | 概览        |
| 个人信息  | `/console/userinfo` | 查看与编辑个人资料 |
| 个人文件  | `/console/personal` | 文件上传与管理   |

### 账户（`/[lang]/account`）

- 登录（用户名/密码，支持 WebAuthn）
- 注册（含 CAPTCHA 校验）
- 登出
- 修改密码

### 工具箱（`/[lang]/tools`）

平台提供的辅助工具集合，如条形码生成、二维码生成等。

## 组件库

公共组件位于 `src/components/` 目录，主要分类：

| 目录          | 说明                   |
|-------------|----------------------|
| `common/`   | 通用基础组件（按钮、表单、弹窗、布局等） |
| `editor/`   | 基于 Slate.js 的富文本编辑器  |
| `markdown/` | Markdown 渲染组件        |
| `image/`    | 图片展示与上传组件            |
| `account/`  | 账户相关 UI 组件           |

## 服务层

`src/services/` 封装了对后端接口（portal / stargate）的调用，包括：

- `account.ts` — 账户认证接口
- `channels.ts` — 频道接口
- `notes.ts` — 文件接口
- `images.ts` — 图片接口
- `files.ts` — 文件接口
- `comments.ts` — 评论接口

## 状态管理

使用 **Jotai** 进行全局状态管理，主要 atom 位于 `src/services/` 和各模块目录中，涵盖：

- 当前用户信息（登录态）
- 语言设置
- 主题模式
