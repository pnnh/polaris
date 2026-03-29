在数据库中新增一张表并同步到仓库。

用法：`/add-table schema.tablename`

请按以下步骤操作：

## 步骤 1：确定 Schema

| 内容类型 | Schema |
|---------|--------|
| 用户账户、会话、公共内容 | `public` |
| 个人隔离数据 | `personal` |
| 社区共享数据 | `community` |

## 步骤 2：编写建表 SQL

通用字段约定：
```sql
CREATE TABLE IF NOT EXISTS community.new_table (
    uid uuid NOT NULL DEFAULT gen_random_uuid(),  -- 主键（UUID v4）
    owner uuid,                                    -- 所有者（关联 public.accounts.uid）
    title character varying(128),                  -- 标题
    description character varying(512),            -- 描述
    body text,                                     -- 内容正文
    status integer DEFAULT 0,                      -- 状态标志
    create_time timestamp with time zone,          -- 创建时间（UTC）
    update_time timestamp with time zone,          -- 更新时间（UTC）
    CONSTRAINT new_table_pkey PRIMARY KEY (uid)
);
```

## 步骤 3：在数据库中创建表

```bash
psql -U postgres -d portal -c "CREATE TABLE IF NOT EXISTS community.new_table (...)"
```

## 步骤 4：导出新表到仓库

```bash
bash export_tables.bash
# 会在 exported_schemas/ 生成 community_new_table.sql
```

## 步骤 5：验证导出文件

检查 `exported_schemas/community_new_table.sql` 内容正确。

## 步骤 6：提交到版本控制

```bash
git add exported_schemas/community_new_table.sql
git commit -m "add community.new_table"
```

---

**如果是添加需要在 `personal` schema 中有路径结构的表**，参考 `personal_files` 表，使用 `ltree` 类型的 `path` 字段：
```sql
path ltree,  -- 需要先 CREATE EXTENSION IF NOT EXISTS ltree;
```
