# 备份恢复工具使用指南

完整的工具功能说明请参见各专项文档：

## 📚 文档索引

| 文档 | 说明 |
|-----|------|
| [IMPORT_USAGE.md](IMPORT_USAGE.md) | 导入工具完整使用指南（命令行参数详解） |
| [VERSION_COMPATIBILITY.md](VERSION_COMPATIBILITY.md) | PostgreSQL 版本兼容性详细说明 |
| [BINARY_DATA_HANDLING.md](BINARY_DATA_HANDLING.md) | 二进制数据处理说明 |

## 🛠️ 工具列表

### 核心工具

- **export_tables.bash** - 导出数据库表（Bash）
- **import_tables.py** - 导入数据库表（Python 3）

### 辅助工具

- **check_pg_compatibility.py** - 版本兼容性检查
- **test_binary_handling.py** - 二进制数据处理测试
- **test_version_detection.py** - 版本检测功能测试

## 🚀 快速开始

### 导出数据

```bash
# 1. 配置数据库信息（编辑 export_tables.bash）
DBNAME="portal"
USER="postgres"

# 2. 执行导出
./export_tables.bash
```

### 导入数据

#### 基础导入（交互式）

```bash
# 1. 配置数据库信息（编辑 import_tables.py）
DBNAME = "portal"
USER = "postgres"

# 2. 导入所有表（交互式确认）
./import_tables.py
```

#### 高级导入（使用命令行参数）

```bash
# 只导入DDL结构
./import_tables.py --action ddl

# 只导入数据
./import_tables.py --action data

# 导入指定表
./import_tables.py --table users

# 自动确认所有操作（批处理模式）
./import_tables.py -y

# 组合使用：自动导入指定表的DDL
./import_tables.py --action ddl --table products -y
```

**详细参数说明请参阅：** [IMPORT_USAGE.md](IMPORT_USAGE.md)

## ✨ 核心功能

### 1. 命令行参数控制

- **--action {ddl,data,all}**: 控制导入类型
  - `ddl`: 仅导入表结构
  - `data`: 仅导入数据
  - `all`: 导入结构和数据（默认）

- **--table TABLE**: 指定要操作的表名

- **-y / --yes**: 自动确认所有操作，适用于批处理

### 2. DDL 冲突检测与差异对比

当目标数据库中存在同名表时，支持：
- ✅ 查看 DDL 差异（unified diff 格式）
- ✅ 选择覆盖或跳过
- ✅ 彩色高亮显示差异
- ✅ 自动确认模式（-y）

### 3. 两阶段导入

- **阶段 1**: DDL 导入（表结构）
- **阶段 2**: 数据导入（表数据）

每个阶段独立确认，支持只导入结构或只导入数据。
可通过 `--action` 参数精确控制。

### 4. 版本兼容性检测

自动检测源数据库和目标数据库版本：
- ✅ PostgreSQL 16 → 18（升级）：良好兼容
- ⚠️ PostgreSQL 18 → 16（降级）：需要确认

### 5. 二进制数据支持

完整支持包含二进制列（bytea）的表，已通过测试验证。

## 📋 版本兼容性

| 源版本 → 目标版本 | 兼容性 | 说明 |
|-----------------|--------|------|
| 16 → 16 | ✅ 最佳 | 同版本，完全兼容 |
| 16 → 17/18 | ✅ 良好 | 向前兼容，建议测试 |
| 18 → 16 | ⚠️ 风险 | 降级有风险，需谨慎 |

## 🔍 测试工具

检查版本兼容性：
```bash
python3 check_pg_compatibility.py
```

测试二进制数据处理：
```bash
python3 test_binary_handling.py
```

测试版本检测：
```bash
python3 test_version_detection.py
```

## 📊 统计信息示例

```
============================================================
恢复完成！统计信息：
------------------------------------------------------------
  总文件数: 30
  DDL 成功导入: 25
  DDL 跳过: 3
  数据成功导入: 22
  数据跳过: 6
  失败数量: 2
============================================================
```

## 💡 最佳实践

### ✅ 推荐
- 同主版本间迁移（如 16.x → 16.y）
- 逐步升级（16 → 17 → 18）
- 先在测试环境验证
- 导入后验证数据完整性

### ⚠️ 避免
- 跨主版本降级
- 直接在生产环境测试
- 忽略脚本警告

## 🔧 依赖要求

- PostgreSQL 客户端工具（psql, pg_dump）
- Python 3.6+（仅标准库）
- Bash 4.0+

---

详细技术说明请参见 [VERSION_COMPATIBILITY.md](VERSION_COMPATIBILITY.md) 和 [BINARY_DATA_HANDLING.md](BINARY_DATA_HANDLING.md)
