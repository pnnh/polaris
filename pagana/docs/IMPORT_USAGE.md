# import_tables.py 使用指南

## 命令行参数

### --action {ddl,data,all}
控制导入操作类型：
- `ddl`: 仅导入表结构（DDL）
- `data`: 仅导入数据
- `all`: 导入表结构和数据（默认）

### --table TABLE
指定要操作的表名（不含schema前缀）。
- 不指定则操作所有表
- 示例：`--table users` 只操作 users 表

### -y, --yes
自动确认所有操作，无需交互式输入。
- 适用于批处理和自动化脚本
- 表冲突时自动覆盖
- 数据导入时自动确认

## 使用示例

### 基础用法

```bash
# 导入所有表（DDL + 数据），交互式确认
python3 import_tables.py

# 显示帮助信息
python3 import_tables.py -h
```

### 只导入DDL

```bash
# 导入所有表的DDL结构
python3 import_tables.py --action ddl

# 导入指定表的DDL
python3 import_tables.py --action ddl --table users

# 自动确认导入所有表的DDL
python3 import_tables.py --action ddl -y
```

### 只导入数据

```bash
# 导入所有表的数据（假设DDL已存在）
python3 import_tables.py --action data

# 导入指定表的数据
python3 import_tables.py --action data --table orders

# 自动确认导入所有表的数据
python3 import_tables.py --action data -y
```

### 导入DDL和数据

```bash
# 导入所有表（默认行为）
python3 import_tables.py --action all

# 导入指定表
python3 import_tables.py --action all --table products

# 自动确认导入指定表
python3 import_tables.py --action all --table products -y

# 自动确认导入所有表
python3 import_tables.py -y
```

## 典型工作流程

### 场景1：分阶段导入（推荐）

```bash
# 第一步：导入所有表结构，检查DDL差异
python3 import_tables.py --action ddl

# 第二步：确认DDL无误后，导入所有数据
python3 import_tables.py --action data -y
```

### 场景2：快速恢复单个表

```bash
# 一键恢复指定表的结构和数据
python3 import_tables.py --table users -y
```

### 场景3：批量自动化导入

```bash
# 无交互导入所有表（生产环境需谨慎）
python3 import_tables.py --action all -y
```

### 场景4：测试DDL兼容性

```bash
# 只导入DDL，手动确认每个表的差异
python3 import_tables.py --action ddl
# 对于每个表，可选择：
#   y - 删除并覆盖
#   n - 跳过该表
#   d - 查看DDL差异
```

## 交互模式说明

### DDL冲突处理（无 -y 参数时）

当表已存在时，会提示：
```
[警告] 表 public.users 已存在于目标数据库！
请选择操作:
  y - 删除并覆盖
  n - 跳过该表
  d - 查看 DDL 差异
您的选择 (y/n/d):
```

选择 `d` 可查看详细的DDL差异对比。

### 数据导入确认（无 -y 参数时）

导入数据前会提示：
```
表结构已重建，是否导入数据?
  y - 导入数据
  n - 跳过数据导入
您的选择 (y/n):
```

如果表中已有数据，会显示警告：
```
[提示] 表中已有 1234 行数据
是否导入数据?
  y - 导入数据 (警告: 将追加到现有 1234 行)
  n - 跳过数据导入
```

## 自动确认模式（-y 参数）

使用 `-y` 参数时：
- DDL冲突：自动删除旧表并覆盖
- 数据导入：自动确认导入
- 版本兼容性警告：仍会显示但不阻塞（仅在有严重警告时需手动确认）

## 版本兼容性

脚本会自动检测源数据库和目标数据库版本：
- **升级**（如 16 → 18）：显示提示，继续执行
- **降级**（如 18 → 16）：显示警告，需确认后继续
- **同版本**：最佳兼容性

## 配置

在脚本顶部配置区域修改：

```python
DBNAME = "portal"        # 目标数据库名
USER = "postgres"        # 数据库用户
HOST = "localhost"       # 数据库主机
INPUT_DIR = "./exported_schemas"  # SQL文件目录
```

## 输出统计

执行完成后会显示统计信息：

```
============================================================
恢复完成！统计信息：
------------------------------------------------------------
  总文件数: 10
  DDL 成功导入: 8
  DDL 跳过: 2
  数据成功导入: 8
  数据跳过: 2
  失败数量: 0
============================================================
```

## 注意事项

1. **自动确认风险**：`-y` 参数会自动覆盖现有表，请谨慎使用
2. **数据追加**：导入数据时不会清空现有数据，而是追加
3. **表名匹配**：`--table` 参数不含schema前缀（如 `users` 而非 `public.users`）
4. **版本兼容**：跨大版本迁移建议先在测试环境验证
5. **二进制数据**：自动处理 PostgreSQL bytea 类型的十六进制编码

## 参考文档

- `VERSION_COMPATIBILITY.md` - 详细的版本兼容性说明
- `BINARY_DATA_HANDLING.md` - 二进制数据处理说明
- `TOOLS_GUIDE.md` - 完整工具集指南
