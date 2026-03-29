#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
测试版本兼容性检测功能
"""

import sys
import re
from pathlib import Path

def extract_source_version_from_sql(sql_file: str):
    """从 SQL 文件中提取源数据库版本"""
    try:
        with open(sql_file, 'r', encoding='utf-8', errors='surrogateescape') as f:
            # 只读取前50行
            for i, line in enumerate(f):
                if i > 50:
                    break
                # 查找版本信息
                if 'Dumped from database version' in line:
                    match = re.search(r'version (\d+)\.(\d+)', line)
                    if match:
                        major = int(match.group(1))
                        minor = int(match.group(2))
                        return (major, minor), line.strip()
        return None, None
    except Exception as e:
        return None, str(e)


def main():
    print("=" * 70)
    print("版本检测功能测试")
    print("=" * 70)
    
    # 测试导出的文件
    input_dir = Path("./exported_schemas")
    
    if not input_dir.exists():
        print("错误: exported_schemas 目录不存在")
        return
    
    sql_files = list(input_dir.glob("*.sql"))
    
    if not sql_files:
        print("错误: 未找到 SQL 文件")
        return
    
    # 从第一个文件提取版本
    test_file = sql_files[0]
    version, version_line = extract_source_version_from_sql(str(test_file))
    
    print(f"\n测试文件: {test_file.name}")
    print("-" * 70)
    
    if version:
        print(f"✓ 成功提取版本信息")
        print(f"  版本行: {version_line}")
        print(f"  解析结果: PostgreSQL {version[0]}.{version[1]}")
        
        # 模拟不同的目标版本场景
        print("\n" + "=" * 70)
        print("版本兼容性场景测试")
        print("=" * 70)
        
        scenarios = [
            (version, "相同版本"),
            ((version[0] + 1, 0), f"升级到 PostgreSQL {version[0] + 1}"),
            ((version[0] + 2, 0), f"跨版本升级到 PostgreSQL {version[0] + 2}"),
            ((version[0] - 1, 0) if version[0] > 10 else (version[0], version[1]), 
             f"降级到 PostgreSQL {version[0] - 1}" if version[0] > 10 else "无降级测试"),
        ]
        
        for target_ver, description in scenarios:
            print(f"\n场景: {description}")
            print(f"  源版本: PostgreSQL {version[0]}.{version[1]}")
            print(f"  目标版本: PostgreSQL {target_ver[0]}.{target_ver[1]}")
            
            if version[0] < target_ver[0]:
                print(f"  结果: ✓ 向前兼容（升级）")
                if target_ver[0] - version[0] > 2:
                    print(f"  提示: ⚠️ 跨度较大，建议测试")
            elif version[0] > target_ver[0]:
                print(f"  结果: ⚠️ 向后兼容（降级），需要确认")
            else:
                print(f"  结果: ✓ 同主版本，兼容性最佳")
    
    else:
        print(f"✗ 未能提取版本信息")
        print(f"  错误: {version_line}")
    
    print("\n" + "=" * 70)
    print("测试完成")
    print("=" * 70)


if __name__ == '__main__':
    main()
