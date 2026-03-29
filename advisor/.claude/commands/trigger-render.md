手动触发文章 Markdown→HTML 转换。

用法：`/trigger-render`

## 方式一：HTTP 接口触发（单篇）

```bash
# 触发单篇文章转换（uid 为文章的 UUID）
curl -X POST http://localhost:8000/articles/{uid}/render

# 查看转换结果
curl http://localhost:8000/articles/{uid}
```

## 方式二：HTTP 接口触发（批量）

```bash
# 触发批量转换（处理所有待转换文章，上限 100 篇）
curl -X POST http://localhost:8000/articles/batch-render
```

## 方式三：Redis Stream 消息触发

```bash
# 向 Redis 流发送消息（article:render 流）
redis-cli XADD article:render '*' uid <article-uuid>
```

## 待转换文章的判断条件

```sql
SELECT uid FROM community.articles
WHERE mimetype = 'text/markdown'
  AND (convert_time IS NULL OR convert_time < update_time);
```

## 验证转换结果

```bash
# 检查 content 字段是否已更新
psql -U postgres -d portal -c \
  "SELECT uid, length(content), convert_time FROM community.articles WHERE uid = '<uuid>';"
```

## 查看服务日志

```bash
# 启动服务并查看实时日志
uv run uvicorn main:app --reload

# 检查 Redis 消费者组状态
redis-cli XINFO GROUPS article:render
redis-cli XPENDING article:render advisor - + 10
```

## 批量转换配置（config/config.yaml）

```yaml
batch_convert:
  enabled: true    # 改为 false 可禁用定时批处理（无需重启）
  interval: 300    # 扫描间隔（秒）
  limit: 100       # 每次处理上限
```

修改配置后**无需重启**，后台任务下次循环时自动读取新配置。
