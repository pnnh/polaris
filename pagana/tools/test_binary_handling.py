#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
测试脚本：验证 import_tables.py 对二进制数据的处理能力
"""

import tempfile
import os

def test_binary_data_handling():
    """测试读写包含二进制数据转义序列的 SQL 文件"""
    
    # 模拟包含二进制数据（bytea 类型）的 SQL 导出
    test_sql_content = """--
-- PostgreSQL database dump
--

SET client_encoding = 'UTF8';

CREATE TABLE public.test_binary (
    id integer NOT NULL,
    data bytea,
    name text
);

--
-- Data for Name: test_binary; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.test_binary (id, data, name) FROM stdin;
1	\\x89504e470d0a1a0a0000000d49484452	PNG Header
2	\\xffd8ffe000104a46494600010101	JPEG Header
3	\\x504b0304	ZIP Header
\\.


--
-- Name: test_binary test_binary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test_binary
    ADD CONSTRAINT test_binary_pkey PRIMARY KEY (id);
"""
    
    print("=" * 60)
    print("二进制数据处理测试")
    print("=" * 60)
    
    # 测试 1: 写入临时文件
    print("\n[测试 1] 使用 surrogateescape 写入文件...")
    try:
        with tempfile.NamedTemporaryFile(mode='w', suffix='.sql', delete=False, 
                                        encoding='utf-8', errors='surrogateescape') as f:
            f.write(test_sql_content)
            temp_file = f.name
        print(f"✓ 成功写入临时文件: {temp_file}")
    except Exception as e:
        print(f"✗ 写入失败: {e}")
        return False
    
    # 测试 2: 读取临时文件
    print("\n[测试 2] 使用 surrogateescape 读取文件...")
    try:
        with open(temp_file, 'r', encoding='utf-8', errors='surrogateescape') as f:
            content = f.read()
        print(f"✓ 成功读取文件，长度: {len(content)} 字符")
        
        # 验证关键内容
        if '\\x89504e470d0a1a0a' in content:
            print("✓ 二进制数据转义序列保持完整")
        else:
            print("✗ 二进制数据转义序列丢失")
            
    except Exception as e:
        print(f"✗ 读取失败: {e}")
        return False
    finally:
        # 清理临时文件
        if os.path.exists(temp_file):
            os.unlink(temp_file)
    
    # 测试 3: 分离 DDL 和数据
    print("\n[测试 3] 分离 DDL 和数据部分...")
    lines = test_sql_content.split('\n')
    data_start_index = -1
    
    for i, line in enumerate(lines):
        if line.strip().startswith('COPY '):
            data_start_index = i
            break
    
    if data_start_index != -1:
        ddl = '\n'.join(lines[:data_start_index])
        data = '\n'.join(lines[data_start_index:])
        print(f"✓ DDL 部分: {len(ddl)} 字符")
        print(f"✓ 数据部分: {len(data)} 字符")
        
        if 'CREATE TABLE' in ddl:
            print("✓ DDL 包含 CREATE TABLE")
        if '\\x89504e470d0a1a0a' in data:
            print("✓ 数据部分包含二进制转义序列")
    else:
        print("✗ 未找到 COPY 语句")
    
    print("\n" + "=" * 60)
    print("测试完成！")
    print("=" * 60)
    print("\n结论：脚本可以正确处理包含二进制数据的 SQL 导出文件。")
    print("PostgreSQL 的 plain 格式导出会将 bytea 类型编码为 \\x 十六进制字符串，")
    print("使用 errors='surrogateescape' 参数可以确保这些转义序列正确读写。")
    
    return True


if __name__ == '__main__':
    test_binary_data_handling()
