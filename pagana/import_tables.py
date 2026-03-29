#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
PostgreSQL 数据库表恢复工具
从导出的 SQL 文件中恢复表，支持冲突检测、DDL 差异对比和用户确认

二进制数据处理说明：
- PostgreSQL 的 plain 格式导出中，二进制列（bytea）会被编码为 \\x 开头的十六进制字符串
- 所有数据在 COPY 或 INSERT 语句中都是文本安全的转义格式
- 本脚本使用 errors='surrogateescape' 参数处理可能的编码问题
- 这确保了包含二进制数据转义序列的文件也能正确读取和恢复
"""

import os
import sys
import subprocess
import tempfile
import re
import argparse
from pathlib import Path
from difflib import unified_diff
from typing import Tuple, Optional

# ========= 配置区域 =========
DBNAME = "portal"
USER = "postgres"
HOST = "localhost"
INPUT_DIR = "./exported_schemas"
# ===========================


class Colors:
    """终端颜色输出"""
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'


def run_psql_command(sql: str, database: str = DBNAME) -> Tuple[bool, str]:
    """执行 PostgreSQL 命令"""
    try:
        result = subprocess.run(
            ['psql', '-h', HOST, '-U', USER, '-d', database, '-t', '-A', '-c', sql],
            capture_output=True,
            text=True,
            check=False
        )
        return result.returncode == 0, result.stdout.strip()
    except Exception as e:
        return False, str(e)


def table_exists(schema: str, table: str) -> bool:
    """检查表是否存在"""
    sql = f"""
    SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = '{schema}' 
        AND tablename = '{table}'
    );
    """
    success, output = run_psql_command(sql)
    return success and output == 't'


def get_table_ddl(schema: str, table: str) -> Optional[str]:
    """获取表的 DDL 定义"""
    try:
        # 使用 pg_dump 导出表结构（仅结构，不含数据）
        result = subprocess.run(
            ['pg_dump', '-h', HOST, '-U', USER, '-d', DBNAME,
             '--schema-only', '-t', f'{schema}.{table}'],
            capture_output=True,
            text=True,
            check=False
        )
        if result.returncode == 0:
            return result.stdout
        return None
    except Exception as e:
        print(f"{Colors.RED}[错误] 获取 DDL 失败: {e}{Colors.END}")
        return None


def extract_ddl_from_file(sql_file: str) -> str:
    """从 SQL 文件中提取 DDL 部分（CREATE TABLE 到第一个 COPY 或 INSERT 之前）"""
    try:
        # 使用 surrogateescape 处理可能的编码问题
        with open(sql_file, 'r', encoding='utf-8', errors='surrogateescape') as f:
            content = f.read()
        
        # 简单提取：从文件开始到第一个 COPY 或 INSERT
        lines = content.split('\n')
        ddl_lines = []
        in_create_section = False
        
        for line in lines:
            # 跳过注释和空行（但保留用于对比）
            if line.strip().startswith('--') and not in_create_section:
                continue
            
            if 'CREATE TABLE' in line.upper():
                in_create_section = True
            
            if in_create_section:
                ddl_lines.append(line)
                
                # 遇到 COPY 或 INSERT 时停止
                if line.strip().startswith(('COPY ', 'INSERT INTO')):
                    # 移除最后一行（COPY/INSERT 行）
                    ddl_lines = ddl_lines[:-1]
                    break
                
                # 遇到表定义结束的分号（后面跟空行或注释）
                if line.strip().endswith(';') and 'CREATE TABLE' not in line.upper():
                    # 继续读取可能的 ALTER TABLE, CREATE INDEX 等
                    continue
        
        return '\n'.join(ddl_lines)
    except Exception as e:
        print(f"{Colors.RED}[错误] 读取文件失败: {e}{Colors.END}")
        return ""


def split_sql_file(sql_file: str) -> Tuple[str, str]:
    """分离 SQL 文件为 DDL 部分和数据部分"""
    try:
        # 使用 surrogateescape 处理可能的编码问题（如二进制数据的转义序列）
        with open(sql_file, 'r', encoding='utf-8', errors='surrogateescape') as f:
            content = f.read()
        
        lines = content.split('\n')
        ddl_lines = []
        data_lines = []
        data_start_index = -1
        
        # 找到数据部分的起始位置
        for i, line in enumerate(lines):
            if line.strip().startswith(('COPY ', 'INSERT INTO')):
                data_start_index = i
                break
        
        if data_start_index == -1:
            # 没有找到数据部分，全部是 DDL
            return content, ""
        
        # 分离 DDL 和数据
        ddl_lines = lines[:data_start_index]
        data_lines = lines[data_start_index:]
        
        return '\n'.join(ddl_lines), '\n'.join(data_lines)
    except Exception as e:
        print(f"{Colors.RED}[错误] 分离 SQL 文件失败: {e}{Colors.END}")
        return "", ""


def table_has_data(schema: str, table: str) -> Tuple[bool, int]:
    """检查表是否有数据，返回 (是否有数据, 行数)"""
    sql = f'SELECT COUNT(*) FROM "{schema}"."{table}";'
    success, output = run_psql_command(sql)
    if success:
        try:
            count = int(output)
            return count > 0, count
        except ValueError:
            return False, 0
    return False, 0


def show_ddl_diff(schema: str, table: str, sql_file: str):
    """显示 DDL 差异"""
    print(f"\n{Colors.CYAN}{'='*60}{Colors.END}")
    print(f"{Colors.CYAN}DDL 差异对比: {schema}.{table}{Colors.END}")
    print(f"{Colors.CYAN}{'='*60}{Colors.END}")
    
    # 获取现有表的 DDL
    existing_ddl = get_table_ddl(schema, table)
    if not existing_ddl:
        print(f"{Colors.YELLOW}无法获取现有表的 DDL{Colors.END}")
        return
    
    # 从文件中提取 DDL
    new_ddl = extract_ddl_from_file(sql_file)
    if not new_ddl:
        print(f"{Colors.YELLOW}无法从文件中提取 DDL{Colors.END}")
        return
    
    # 生成差异
    existing_lines = existing_ddl.splitlines(keepends=True)
    new_lines = new_ddl.splitlines(keepends=True)
    
    diff = unified_diff(
        existing_lines,
        new_lines,
        fromfile=f'当前数据库: {schema}.{table}',
        tofile=f'导入文件: {os.path.basename(sql_file)}',
        lineterm=''
    )
    
    diff_output = list(diff)
    if not diff_output:
        print(f"{Colors.GREEN}✓ 没有差异，DDL 完全相同{Colors.END}")
    else:
        for line in diff_output:
            line = line.rstrip()
            if line.startswith('---') or line.startswith('+++'):
                print(f"{Colors.BOLD}{line}{Colors.END}")
            elif line.startswith('-'):
                print(f"{Colors.RED}{line}{Colors.END}")
            elif line.startswith('+'):
                print(f"{Colors.GREEN}{line}{Colors.END}")
            elif line.startswith('@@'):
                print(f"{Colors.CYAN}{line}{Colors.END}")
            else:
                print(line)
    
    print(f"{Colors.CYAN}{'='*60}{Colors.END}\n")


def drop_table(schema: str, table: str) -> bool:
    """删除表"""
    sql = f'DROP TABLE IF EXISTS "{schema}"."{table}" CASCADE;'
    try:
        result = subprocess.run(
            ['psql', '-h', HOST, '-U', USER, '-d', DBNAME, '-c', sql],
            capture_output=True,
            text=True,
            check=False
        )
        return result.returncode == 0
    except Exception as e:
        print(f"{Colors.RED}[错误] 删除表失败: {e}{Colors.END}")
        return False


def import_table(sql_file: str) -> bool:
    """导入表"""
    try:
        result = subprocess.run(
            ['psql', '-h', HOST, '-U', USER, '-d', DBNAME, '-f', sql_file],
            capture_output=True,
            text=True,
            check=False
        )
        return result.returncode == 0
    except Exception as e:
        print(f"{Colors.RED}[错误] 导入失败: {e}{Colors.END}")
        return False


def import_sql_content(sql_content: str) -> bool:
    """导入 SQL 内容（通过临时文件）"""
    try:
        # 使用 surrogateescape 确保二进制数据的转义序列正确写入
        with tempfile.NamedTemporaryFile(mode='w', suffix='.sql', delete=False, encoding='utf-8', errors='surrogateescape') as f:
            f.write(sql_content)
            temp_file = f.name
        
        try:
            result = subprocess.run(
                ['psql', '-h', HOST, '-U', USER, '-d', DBNAME, '-f', temp_file],
                capture_output=True,
                text=True,
                check=False
            )
            return result.returncode == 0
        finally:
            # 删除临时文件
            if os.path.exists(temp_file):
                os.unlink(temp_file)
    except Exception as e:
        print(f"{Colors.RED}[错误] 导入失败: {e}{Colors.END}")
        return False


def parse_filename(filename: str) -> Tuple[str, str]:
    """从文件名解析 schema 和表名"""
    # 例如: public_users.sql -> (public, users)
    name_without_ext = filename.replace('.sql', '')
    parts = name_without_ext.split('_', 1)
    if len(parts) == 2:
        return parts[0], parts[1]
    return 'public', name_without_ext


def get_pg_version() -> Optional[Tuple[int, int]]:
    """获取目标数据库的 PostgreSQL 版本"""
    try:
        result = subprocess.run(
            ['psql', '-h', HOST, '-U', USER, '-d', DBNAME, '-t', '-A', '-c', 'SHOW server_version;'],
            capture_output=True,
            text=True,
            check=False
        )
        
        if result.returncode == 0:
            version_str = result.stdout.strip()
            # 解析版本号，例如: "16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)"
            match = re.match(r'(\d+)\.(\d+)', version_str)
            if match:
                major = int(match.group(1))
                minor = int(match.group(2))
                return (major, minor)
        
        return None
    except Exception as e:
        return None


def extract_source_version_from_sql(sql_file: str) -> Optional[Tuple[int, int]]:
    """从 SQL 文件中提取源数据库版本"""
    try:
        with open(sql_file, 'r', encoding='utf-8', errors='surrogateescape') as f:
            # 只读取前50行，版本信息通常在文件开头
            for i, line in enumerate(f):
                if i > 50:
                    break
                # 查找类似 "-- Dumped from database version 16.11" 的行
                if 'Dumped from database version' in line:
                    match = re.search(r'version (\d+)\.(\d+)', line)
                    if match:
                        major = int(match.group(1))
                        minor = int(match.group(2))
                        return (major, minor)
        return None
    except Exception as e:
        return None


def check_version_compatibility(source_version: Optional[Tuple[int, int]], 
                                target_version: Optional[Tuple[int, int]]) -> dict:
    """检查版本兼容性"""
    if not source_version or not target_version:
        return {
            'show_warning': False,
            'messages': []
        }
    
    source_major, _ = source_version
    target_major, _ = target_version
    
    messages = []
    show_warning = False
    
    # 向后兼容（新→旧）- 高风险
    if source_major > target_major:
        show_warning = True
        messages.append(f"版本降级警告：从 PostgreSQL {source_major} 导入到 {target_major}")
        messages.append(f"  - 新版本特性可能不兼容")
        messages.append(f"  - 强烈建议先在测试环境验证")
    
    # 向前兼容（旧→新）- 中等风险
    elif source_major < target_major:
        version_gap = target_major - source_major
        if version_gap > 2:
            show_warning = True
            messages.append(f"版本升级提示：从 PostgreSQL {source_major} 导入到 {target_major}")
            messages.append(f"  - 跨越 {version_gap} 个主版本，请留意兼容性")
    
    return {
        'show_warning': show_warning,
        'messages': messages
    }


def parse_arguments():
    """解析命令行参数"""
    parser = argparse.ArgumentParser(
        description='PostgreSQL 数据库表恢复工具',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
示例用法:
  %(prog)s --action all                    # 导入所有表的DDL和数据
  %(prog)s --action ddl                    # 只导入所有表的DDL
  %(prog)s --action data                   # 只导入所有表的数据
  %(prog)s --action ddl --table users      # 只导入users表的DDL
  %(prog)s --action all --table users -y   # 导入users表，自动确认
  %(prog)s -y                              # 导入所有表，自动确认所有操作
        '''
    )
    
    parser.add_argument(
        '--action',
        choices=['ddl', 'data', 'all'],
        default='all',
        help='导入动作: ddl=仅DDL, data=仅数据, all=DDL和数据 (默认: all)'
    )
    
    parser.add_argument(
        '--table',
        type=str,
        help='指定要操作的表名（不含schema前缀），例如: users。不指定则操作所有表'
    )
    
    parser.add_argument(
        '-y', '--yes',
        action='store_true',
        help='自动确认所有操作，不提示用户输入'
    )
    
    return parser.parse_args()



def main():
    # 解析命令行参数
    args = parse_arguments()
    
    print(f"{Colors.BOLD}{'='*60}")
    print("PostgreSQL 数据库表恢复工具")
    print(f"{'='*60}{Colors.END}")
    print(f"目标数据库: {Colors.CYAN}{DBNAME}{Colors.END}")
    print(f"导入目录: {Colors.CYAN}{INPUT_DIR}{Colors.END}")
    print(f"导入动作: {Colors.CYAN}{args.action}{Colors.END}")
    if args.table:
        print(f"指定表名: {Colors.CYAN}{args.table}{Colors.END}")
    if args.yes:
        print(f"自动确认: {Colors.GREEN}是{Colors.END}")
    
    # 检测目标数据库版本
    target_version = get_pg_version()
    if target_version:
        print(f"目标数据库版本: {Colors.CYAN}PostgreSQL {target_version[0]}.{target_version[1]}{Colors.END}")
    
    print(f"{Colors.BOLD}{'-'*60}{Colors.END}\n")
    
    # 检查输入目录
    input_path = Path(INPUT_DIR)
    if not input_path.exists() or not input_path.is_dir():
        print(f"{Colors.RED}[错误] 导入目录不存在: {INPUT_DIR}{Colors.END}")
        sys.exit(1)
    
    # 统计信息
    stats = {
        'total': 0,
        'imported': 0,
        'skipped': 0,
        'error': 0,
        'data_imported': 0,
        'data_skipped': 0
    }
    
    # 查找所有 SQL 文件
    sql_files = sorted(input_path.glob('*.sql'))
    
    # 如果指定了表名，则过滤文件
    if args.table:
        filtered_files = []
        for sql_file in sql_files:
            _, table_name = parse_filename(sql_file.name)
            if table_name == args.table:
                filtered_files.append(sql_file)
        
        if not filtered_files:
            print(f"{Colors.YELLOW}[提示] 未找到表 '{args.table}' 对应的 SQL 文件{Colors.END}")
            return
        
        sql_files = filtered_files
    
    if not sql_files:
        print(f"{Colors.YELLOW}[提示] 未找到 .sql 文件{Colors.END}")
        return
    
    # 检查源版本（从第一个文件提取）
    source_version = None
    version_checked = False
    
    for sql_file in sql_files:
        stats['total'] += 1
        filename = sql_file.name
        schema, table_name = parse_filename(filename)
        
        # 首次检查版本兼容性
        if not version_checked and target_version and not args.yes:
            source_version = extract_source_version_from_sql(str(sql_file))
            if source_version:
                print(f"{Colors.CYAN}检测到源数据库版本: PostgreSQL {source_version[0]}.{source_version[1]}{Colors.END}")
                
                # 检查兼容性
                compat = check_version_compatibility(source_version, target_version)
                if compat['show_warning']:
                    print(f"\n{Colors.YELLOW}{'='*60}{Colors.END}")
                    for msg in compat['messages']:
                        print(f"{Colors.YELLOW}{msg}{Colors.END}")
                    print(f"{Colors.YELLOW}{'='*60}{Colors.END}\n")
                    
                    # 询问是否继续
                    confirm = input(f"是否继续导入? (y/n): ").strip().lower()
                    if confirm != 'y':
                        print(f"\n{Colors.YELLOW}[提示] 用户取消操作{Colors.END}")
                        sys.exit(0)
                    print()
            
            version_checked = True
        
        print(f"\n{Colors.BOLD}[{stats['total']}] 处理文件: {filename}{Colors.END}")
        print(f"    解析为: Schema={Colors.CYAN}{schema}{Colors.END}, " 
              f"Table={Colors.CYAN}{table_name}{Colors.END}")
        
        # 分离 DDL 和数据部分
        ddl_content, data_content = split_sql_file(str(sql_file))
        
        # 标记：是否需要导入 DDL
        should_import_ddl = args.action in ('ddl', 'all')
        table_was_dropped = False
        skip_this_table = False
        
        # 检查表是否存在（仅在需要导入DDL时检查）
        if should_import_ddl and table_exists(schema, table_name):
            print(f"    {Colors.YELLOW}[警告] 表 {schema}.{table_name} "
                  f"已存在于目标数据库！{Colors.END}")
            
            if args.yes:
                # 自动确认模式：直接删除并覆盖
                print(f"    {Colors.GREEN}=> 自动确认：删除并覆盖{Colors.END}")
                print(f"    {Colors.BLUE}=> 正在删除旧表...{Colors.END}")
                if not drop_table(schema, table_name):
                    print(f"    {Colors.RED}[错误] 删除表失败！{Colors.END}")
                    stats['error'] += 1
                    skip_this_table = True
                else:
                    table_was_dropped = True
            else:
                # 交互模式
                while True:
                    print(f"    请选择操作:")
                    print(f"      {Colors.GREEN}y{Colors.END} - 删除并覆盖")
                    print(f"      {Colors.YELLOW}n{Colors.END} - 跳过该表")
                    print(f"      {Colors.CYAN}d{Colors.END} - 查看 DDL 差异")
                    choice = input(f"    您的选择 (y/n/d): ").strip().lower()
                    
                    if choice == 'd':
                        # 显示 DDL 差异
                        show_ddl_diff(schema, table_name, str(sql_file))
                        # 继续循环，再次询问
                        continue
                    elif choice == 'y':
                        # 删除并覆盖
                        print(f"    {Colors.BLUE}=> 正在删除旧表...{Colors.END}")
                        if not drop_table(schema, table_name):
                            print(f"    {Colors.RED}[错误] 删除表失败！{Colors.END}")
                            stats['error'] += 1
                            skip_this_table = True
                            break
                        table_was_dropped = True
                        # 继续导入
                        break
                    elif choice == 'n':
                        # 跳过 DDL 导入，但可能还需要导入数据
                        print(f"    {Colors.YELLOW}=> 跳过 DDL 导入{Colors.END}")
                        should_import_ddl = False
                        stats['skipped'] += 1
                        break
                    else:
                        print(f"    {Colors.RED}无效的选择，请输入 y、n 或 d{Colors.END}")
                        continue
        
        # 如果标记为跳过，则继续下一个表
        if skip_this_table:
            continue
        
        # ========== 第一阶段：导入 DDL ==========
        if should_import_ddl:
            print(f"    {Colors.BLUE}=> 正在导入表结构 (DDL)...{Colors.END}")
            if ddl_content:
                if import_sql_content(ddl_content):
                    print(f"    {Colors.GREEN}[成功] DDL 导入完成{Colors.END}")
                    stats['imported'] += 1
                else:
                    print(f"    {Colors.RED}[错误] DDL 导入失败！{Colors.END}")
                    stats['error'] += 1
                    continue  # 跳过数据导入
            else:
                print(f"    {Colors.YELLOW}[提示] 未找到 DDL 内容{Colors.END}")
                continue
        elif args.action == 'ddl':
            # 如果动作是仅DDL，但表已存在且选择跳过，则计入跳过统计
            # （这种情况在上面的逻辑中已经处理，这里不需要额外操作）
            pass
        
        # ========== 第二阶段：导入数据 ==========
        # 仅在 action 为 data 或 all 时导入数据
        if args.action in ('data', 'all') and data_content:
            # 检查表是否已有数据
            has_data, row_count = table_has_data(schema, table_name)
            
            if has_data and not table_was_dropped:
                print(f"    {Colors.YELLOW}[提示] 表中已有 {row_count} 行数据{Colors.END}")
            
            # 根据是否自动确认决定是否导入数据
            should_import_data = False
            
            if args.yes:
                # 自动确认模式
                should_import_data = True
                if has_data and not table_was_dropped:
                    print(f"    {Colors.GREEN}=> 自动确认：导入数据（将追加到现有 {row_count} 行）{Colors.END}")
                else:
                    print(f"    {Colors.GREEN}=> 自动确认：导入数据{Colors.END}")
            else:
                # 交互模式：询问是否导入数据
                while True:
                    if table_was_dropped:
                        # 如果刚删除重建，默认提示导入数据
                        print(f"    表结构已重建，是否导入数据?")
                    else:
                        print(f"    是否导入数据?")
                    
                    print(f"      {Colors.GREEN}y{Colors.END} - 导入数据" + 
                          (f" (警告: 将追加到现有 {row_count} 行)" if has_data and not table_was_dropped else ""))
                    print(f"      {Colors.YELLOW}n{Colors.END} - 跳过数据导入")
                    data_choice = input(f"    您的选择 (y/n): ").strip().lower()
                    
                    if data_choice == 'y':
                        should_import_data = True
                        break
                    elif data_choice == 'n':
                        print(f"    {Colors.YELLOW}=> 跳过数据导入{Colors.END}")
                        stats['data_skipped'] += 1
                        break
                    else:
                        print(f"    {Colors.RED}无效的选择，请输入 y 或 n{Colors.END}")
                        continue
            
            # 执行数据导入
            if should_import_data:
                print(f"    {Colors.BLUE}=> 正在导入数据...{Colors.END}")
                if import_sql_content(data_content):
                    # 检查导入后的行数
                    _, new_count = table_has_data(schema, table_name)
                    print(f"    {Colors.GREEN}[成功] 数据导入完成，当前共 {new_count} 行{Colors.END}")
                    stats['data_imported'] += 1
                else:
                    print(f"    {Colors.RED}[错误] 数据导入失败！{Colors.END}")
                    stats['error'] += 1
        elif args.action in ('data', 'all') and not data_content:
            print(f"    {Colors.YELLOW}[提示] 未找到数据内容{Colors.END}")
    
    # 输出统计信息
    print(f"\n{Colors.BOLD}{'='*60}")
    print("恢复完成！统计信息：")
    print(f"{'-'*60}{Colors.END}")
    print(f"  总文件数: {Colors.CYAN}{stats['total']}{Colors.END}")
    print(f"  DDL 成功导入: {Colors.GREEN}{stats['imported']}{Colors.END}")
    print(f"  DDL 跳过: {Colors.YELLOW}{stats['skipped']}{Colors.END}")
    print(f"  数据成功导入: {Colors.GREEN}{stats['data_imported']}{Colors.END}")
    print(f"  数据跳过: {Colors.YELLOW}{stats['data_skipped']}{Colors.END}")
    print(f"  失败数量: {Colors.RED}{stats['error']}{Colors.END}")
    print(f"{Colors.BOLD}{'='*60}{Colors.END}")


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}[提示] 用户中断操作{Colors.END}")
        sys.exit(0)
    except Exception as e:
        print(f"\n{Colors.RED}[错误] 发生异常: {e}{Colors.END}")
        sys.exit(1)
