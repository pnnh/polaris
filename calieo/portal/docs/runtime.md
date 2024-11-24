### 配置说明

运行时配置默认放置于runtime目录，需要从源码树中排除

示例格式（非真实配置信息）：

```yaml
ACCOUNT_DB: host=127.0.0.1 user=postgres password=postgres dbname=multiverse port=5432 sslmode=disable
JWT_KEY: Y24tWIV7lkh4uXXDOCGOA5xTJ0xGMohP
OAUTH2_PRIVATE_KEY: file://runtime/data/rs256-private.pem
OAUTH2_PUBLIC_KEY: file://runtime/data/rs256-public.pem
OAUTH2_JWK: file://runtime/data/rs256-jwk.json
WEB_URL: https://portal.huable.com
SELF_URL: https://portal.huable.com
MAIL_HOST: smtp.abc.com
MAIL_PORT: 587
MAIL_USER: support@huable.com
MAIL_PASSWORD: igNFrlXRKptzGe5i
MAIL_SENDER: support@huable.com
RPID: portal.huable.com
RPOrigins: https://portal.huable.com

sign:
  webauthn: 
    enable: true
  main:
    enable: true
  password: 
    enable: true
```