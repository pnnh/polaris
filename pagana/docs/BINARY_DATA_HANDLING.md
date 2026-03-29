# 二进制数据处理说明

## 问题背景

当 PostgreSQL 数据库中包含二进制数据列（如 `bytea` 类型）时，使用 `pg_dump` 的 plain 格式导出会产生特殊的文本编码格式。

## PostgreSQL 的处理方式

### 二进制数据编码

PostgreSQL 在 plain 格式导出中，会将二进制列（bytea）编码为文本安全的格式：

```sql
-- 示例：包含二进制数据的表
CREATE TABLE files (
    id integer,
    data bytea,
    name text
);

-- COPY 语句中的二进制数据会编码为 \x 十六进制字符串
COPY files (id, data, name) FROM stdin;
1	\\x89504e470d0a1a0a0000000d49484452	PNG Header
2	\\xffd8ffe000104a46494600010101	JPEG Header
3	\\x504b0304	ZIP Header
\.
```

### 编码格式

- **十六进制编码**：`\\x` 开头，后面跟十六进制数字
- **转义字符**：特殊字符使用反斜杠转义
- **文本安全**：所有数据都是 ASCII 可打印字符

## import_tables.py 的处理机制

### 1. 编码容错读取

```python
# 使用 errors='surrogateescape' 参数
with open(sql_file, 'r', encoding='utf-8', errors='surrogateescape') as f:
    content = f.read()
```

**作用**：
- 处理可能的编码问题
- 保留原始字节序列
- 避免因非标准字符导致的读取失败

### 2. 文件分离处理

脚本将 SQL 文件分为两部分：
- **DDL 部分**：表结构定义（纯文本）
- **数据部分**：COPY/INSERT 语句（可能包含二进制转义序列）

### 3. 临时文件写入

```python
with tempfile.NamedTemporaryFile(mode='w', suffix='.sql', delete=False, 
                                encoding='utf-8', errors='surrogateescape') as f:
    f.write(sql_content)
```

**保证**：
- 二进制转义序列完整保留
- 正确传递给 psql 执行
- 避免编码转换导致的数据损坏

## 验证测试

运行测试脚本验证处理能力：

```bash
python3 test_binary_handling.py
```

测试结果：
- ✓ 成功写入包含二进制转义序列的文件
- ✓ 成功读取并保持数据完整
- ✓ 正确分离 DDL 和数据部分
- ✓ 二进制转义序列完整保留

## 支持的数据类型

脚本支持所有 PostgreSQL 导出的数据类型，包括：

1. **文本类型**：text, varchar, char
2. **数值类型**：integer, bigint, numeric, real
3. **日期时间**：timestamp, date, time, interval
4. **二进制类型**：bytea（十六进制编码）
5. **JSON类型**：json, jsonb
6. **数组类型**：所有数组类型
7. **自定义类型**：enum, composite types

## 注意事项

### 成功案例
- ✓ pg_dump plain 格式（默认）
- ✓ 包含 bytea 列的表
- ✓ 包含特殊字符的文本数据
- ✓ 多字节字符（中文、日文等）

### 潜在问题
- ⚠️ 如果原始导出文件已损坏（编码错误），脚本会尽力处理但可能失败
- ⚠️ 非 pg_dump 生成的 SQL 文件可能格式不兼容

### 推荐做法
1. 使用标准的 `pg_dump` 导出（plain 格式）
2. 确保导出时指定 `--encoding=UTF8`
3. 如遇到编码问题，检查原始导出文件的编码

## 总结

**import_tables.py 已经正确处理了二进制数据列的逻辑**：

1. ✅ 使用 `errors='surrogateescape'` 容错读取
2. ✅ 保持二进制转义序列完整
3. ✅ 正确传递给 PostgreSQL 执行
4. ✅ 通过测试验证

用户可以放心使用本脚本恢复包含二进制数据的数据库表。
