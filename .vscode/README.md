### DBHUB MCP启动方式

```bash
# 调用以下Docker命令启动服务，并传递数据库链接字符串
docker run -d --rm --init \
   --name dbhub \
   --publish 8091:8091 \
   bytebase/dbhub \
   --transport http \
   --port 8091 \
   --dsn "postgres://postgres:123456@host.docker.internal:5432/portal?sslmode=disable"
```


#### Chrome DevTools启动方式

```bash
# 在.bashrc或.zshrc中添加一下别名
# chrome调试用途
alias chromeDebug='"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port=9223 \
  --user-data-dir="$HOME/Library/Application Support/Google/ChromeDebug" \
  --no-first-run \
  --no-default-browser-check \
  --disable-background-networking \
  --disable-sync \
  --disable-features=OptimizationHints \
  --enable-logging=stderr --v=0'   # 降低日志级别，可选
# 然后调用启动带mcp服务的独立窗口，再该浏览器窗口中打开页面
chromeDebug
```