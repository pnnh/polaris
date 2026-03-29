# Portal API 参考

以下列出 portal 服务对外暴露的主要 HTTP 接口。所有接口前缀为 `/portal`（由反向代理决定），鉴权接口通过 `Portal-Authorization` 请求头传递 JWT Token。

## 健康检查

| 方法 | 路径 | 描述 |
|---|---|---|
| GET | `/portal/healthz` | 服务存活检查 |

## 账户认证

| 方法 | 路径 | 描述 |
|---|---|---|
| POST | `/account/signup` | 注册新账户 |
| POST | `/account/signin` | 账户登录，返回 JWT |
| POST | `/account/signout` | 登出，销毁会话 |
| GET | `/account/session` | 获取当前会话信息 |
| GET | `/account/userinfo` | 获取当前用户信息 |
| POST | `/account/email/verify` | 发送/校验邮箱验证码 |

### WebAuthn（无密码认证）

| 方法 | 路径 | 描述 |
|---|---|---|
| POST | `/account/signup/webauthn/begin/:username` | 开始 WebAuthn 注册 |
| POST | `/account/signup/webauthn/finish/:username` | 完成 WebAuthn 注册 |
| POST | `/account/signin/webauthn/begin/:username` | 开始 WebAuthn 登录 |
| POST | `/account/signin/webauthn/finish/:username` | 完成 WebAuthn 登录 |

## 频道

| 方法 | 路径 | 描述 |
|---|---|---|
| GET | `/channels` | 公开频道列表 |
| GET | `/channels/:urn` | 获取指定频道 |
| POST | `/console/channels` | 创建频道（需登录） |
| PUT | `/console/channels/:urn` | 更新频道（需登录） |

## 笔记

| 方法 | 路径 | 描述 |
|---|---|---|
| GET | `/notes` | 公开笔记列表 |
| GET | `/notes/:urn` | 获取笔记详情 |
| GET | `/notes/:urn/assets/*path` | 获取笔记附件资源 |
| GET | `/console/notes` | 我的笔记列表（需登录） |

## 图片

| 方法 | 路径 | 描述 |
|---|---|---|
| GET | `/images` | 图片列表 |
| GET | `/images/:urn` | 图片详情 |
| POST | `/images` | 上传图片（需登录） |

## 评论

| 方法 | 路径 | 描述 |
|---|---|---|
| GET | `/comments` | 评论列表（按目标资源查询） |
| POST | `/comments` | 发布评论（需登录） |
| DELETE | `/comments/:urn` | 删除评论（需登录） |

## 浏览记录

| 方法 | 路径 | 描述 |
|---|---|---|
| POST | `/viewers` | 记录内容浏览（需登录） |
| GET | `/viewers` | 查询浏览记录（需登录） |

## 云端文件

| 方法 | 路径 | 描述 |
|---|---|---|
| GET | `/files/:urn` | 下载文件 |
| POST | `/files` | 上传文件（需登录） |
| DELETE | `/files/:urn` | 删除文件（需登录） |

## 认证方式

portal 使用 **JWT（RS256）** 进行认证：

1. 登录后服务端返回 JWT Token
2. 后续请求在 HTTP Header 中携带：`Portal-Authorization: <token>`
3. Token 由 `JWT_PRIVATE_KEY`（RSA 私钥）签名，由 `JWT_PUBLIC_KEY` 验证

stargate 服务通过内部地址调用 portal 的 `/account/userinfo` 接口完成身份验证委托。
