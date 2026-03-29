# 更新日志

## 2026-02-26 - 命令行参数增强

### 新增功能

#### 1. 命令行参数支持

- **--action {ddl,data,all}**: 控制导入操作类型
  - `ddl`: 仅导入表结构（CREATE TABLE）
  - `data`: 仅导入数据（COPY/INSERT）
  - `all`: 导入结构和数据（默认行为）

- **--table TABLE**: 指定要操作的表名
  - 不含 schema 前缀（如 `users` 而非 `public.users`）
  - 不指定则操作所有表

- **-y, --yes**: 自动确认所有操作
  - 表冲突时自动删除并覆盖
  - 数据导入时自动确认
  - 适用于批处理和自动化脚本

#### 2. 使用示例

```bash
# 只导入所有表的DDL
./import_tables.py --action ddl

# 只导入指定表的数据
./import_tables.py --action data --table users

# 自动确认导入指定表
./import_tables.py --table products -y

# 完全自动化导入所有表
./import_tables.py -y
```

### 改进内容

1. **更灵活的控制**：可以单独导入DDL或数据
2. **批处理支持**：`-y` 参数消除交互提示
3. **精确操作**：`--table` 参数只操作指定表
4. **向后兼容**：不带参数时行为与之前完全相同

### 典型工作流程

#### 分阶段导入（推荐）

```bash
# 第一步：导入所有表结构，手动检查DDL差异
./import_tables.py --action ddl

# 第二步：确认DDL无误后，批量导入数据
./import_tables.py --action data -y
```

#### 快速恢复单表

```bash
# 一键重建指定表（结构+数据）
./import_tables.py --table users -y
```

### 测试验证

所有功能已通过测试：

```bash
# ✅ 测试1: DDL导入
python3 import_tables.py --action ddl --table files -y
# 结果: DDL成功导入，数据跳过

# ✅ 测试2: 数据导入
python3 import_tables.py --action data --table files -y
# 结果: DDL跳过，数据成功导入

# ✅ 测试3: 完整导入
python3 import_tables.py --action all --table links -y
# 结果: DDL和数据都成功导入

# ✅ 测试4: 两阶段工作流程
python3 import_tables.py --action ddl --table notebooks -y
python3 import_tables.py --action data --table notebooks -y
# 结果: 分阶段导入成功
```

### 文档更新

1. **新增**: [IMPORT_USAGE.md](IMPORT_USAGE.md) - 详细的命令行参数使用指南
2. **更新**: [TOOLS_GUIDE.md](TOOLS_GUIDE.md) - 添加命令行参数快速参考

### 技术细节

- 使用 Python `argparse` 模块处理命令行参数
- 保持向后兼容：默认行为（无参数）与之前一致
- 自动确认模式仍会显示版本兼容性警告（严重警告需确认）
- 支持 `-h` / `--help` 显示完整帮助信息

### 兼容性

- Python 3.6+
- PostgreSQL 10+
- 所有现有功能保持不变：
  - DDL差异对比（`d` 选项）
  - 版本兼容性检测
  - 二进制数据处理
  - 两阶段导入
