#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
PostgreSQL 版本兼容性检查工具
检查导出和导入数据库的版本，提供兼容性建议
"""

import subprocess
import re
from typing import Tuple, Optional

def get_pg_version(host: str = "localhost", user: str = "postgres", dbname: str = "portal") -> Optional[Tuple[int, int, int]]:
    """获取 PostgreSQL 版本号"""
    try:
        result = subprocess.run(
            ['psql', '-h', host, '-U', user, '-d', dbname, '-t', '-A', '-c', 'SHOW server_version;'],
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
                return (major, minor, 0)
        
        return None
    except Exception as e:
        print(f"获取版本失败: {e}")
        return None


def check_compatibility(source_version: Tuple[int, int, int], target_version: Tuple[int, int, int]) -> dict:
    """检查版本兼容性"""
    source_major = source_version[0]
    target_major = target_version[0]
    
    result = {
        'compatible': True,
        'warnings': [],
        'recommendations': []
    }
    
    # 向前兼容（旧→新）
    if source_major < target_major:
        result['warnings'].append(
            f"从 PostgreSQL {source_major} 升级到 {target_major}"
        )
        result['recommendations'].extend([
            "✓ 通常向前兼容性较好，但请注意：",
            "  - 某些弃用的功能可能已移除",
            "  - 数据类型的默认行为可能改变",
            "  - 建议先在测试环境验证"
        ])
    
    # 向后兼容（新→旧）
    elif source_major > target_major:
        result['compatible'] = False
        result['warnings'].append(
            f"警告：从 PostgreSQL {source_major} 降级到 {target_major}"
        )
        result['recommendations'].extend([
            "⚠️ 向后兼容性风险较高：",
            f"  - PostgreSQL {source_major} 的新特性在 {target_major} 中不可用",
            "  - 新的数据类型、函数可能不支持",
            "  - 强烈建议先测试验证",
            "  - 考虑使用 --no-tablespaces 和 --no-owner 选项"
        ])
    
    # 同版本
    else:
        result['recommendations'].append(
            f"✓ 相同主版本 (PostgreSQL {source_major})，兼容性最佳"
        )
    
    # 版本差距检查
    version_gap = abs(source_major - target_major)
    if version_gap > 2:
        result['warnings'].append(
            f"版本跨度较大 ({version_gap} 个主版本)"
        )
        result['recommendations'].append(
            "  - 建议查阅版本发布说明了解重大变更"
        )
    
    return result


def main():
    print("=" * 70)
    print("PostgreSQL 版本兼容性检查")
    print("=" * 70)
    
    # 示例：检查不同版本场景
    test_scenarios = [
        ((16, 11, 0), (18, 0, 0), "PostgreSQL 16 → 18（升级）"),
        ((18, 0, 0), (16, 11, 0), "PostgreSQL 18 → 16（降级）"),
        ((16, 11, 0), (16, 12, 0), "PostgreSQL 16.11 → 16.12（同主版本）"),
        ((14, 0, 0), (18, 0, 0), "PostgreSQL 14 → 18（跨大版本升级）"),
    ]
    
    for source, target, description in test_scenarios:
        print(f"\n{description}")
        print("-" * 70)
        print(f"源版本: PostgreSQL {source[0]}.{source[1]}")
        print(f"目标版本: PostgreSQL {target[0]}.{target[1]}")
        
        compat = check_compatibility(source, target)
        
        if compat['compatible']:
            print("✓ 兼容性: 良好")
        else:
            print("⚠️ 兼容性: 需要注意")
        
        if compat['warnings']:
            print("\n警告:")
            for warning in compat['warnings']:
                print(f"  {warning}")
        
        if compat['recommendations']:
            print("\n建议:")
            for rec in compat['recommendations']:
                print(f"  {rec}")
    
    print("\n" + "=" * 70)
    print("通用兼容性建议")
    print("=" * 70)
    print("""
1. 导出时的推荐选项：
   --no-owner          # 不导出对象所有者
   --no-privileges     # 不导出权限
   --quote-all-identifiers  # 引用所有标识符
   --encoding=UTF8     # 使用 UTF-8 编码

2. 版本兼容性最佳实践：
   - 优先同主版本间迁移（如 16.x → 16.y）
   - 升级路径：16 → 17 → 18（逐步升级更安全）
   - 降级需谨慎，建议避免跨主版本降级
   
3. 测试流程：
   - 先在测试数据库验证导入
   - 检查导入日志中的警告和错误
   - 验证数据完整性和应用兼容性
   
4. 已知兼容性问题：
   - PostgreSQL 10+ 移除了某些旧语法
   - 15+ 改变了权限系统默认值
   - 17+ 可能带来重大变更（检查发布说明）
    """)


if __name__ == '__main__':
    main()
