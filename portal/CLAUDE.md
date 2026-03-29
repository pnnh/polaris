# portal — 公共 API 及账户认证服务

希波万象平台的 Go 后端服务，提供公共内容查询接口和账户认证体系（注册、登录、会话管理、WebAuthn）。

## 技术栈

- **语言**: Go 1.24
- **HTTP 框架**: Gin v1.11
- **数据库**: PostgreSQL + sqlx（原生 SQL，无 ORM）
- **认证**: JWT RS256 + WebAuthn (FIDO2)
- **缓存/消息队列**: Redis v9
- **机器人防护**: Cloudflare Turnstile
- **运行端口**: 8001

## 常用命令

```bash
go run . --config file://config/host.yml          # 启动 portal 服务
go run . --svcrole syncer --config file://...      # 启动同步进程
go build -o ./portal .                             # 编译
docker build --progress=plain -t portal .          # 构建 Docker 镜像
```
 

## API 路由需增加前缀 `/portal`
 
## 认证机制
   
## 数据库访问

**使用原生 SQL + sqlx，不使用 ORM。**
      
## 重要约定

- 所有数据库查询使用命名参数（`:param`），防止 SQL 注入  
