---
image: cover.jpg
---

针对包含parent字段的表示层级结构的表，当指定叶子节点时，可以通过递归查询的方式查找到所有的父级节点

示例代码

```sql

with recursive result(root_pk, root_name, leaf_pk, leaf_name, root_level, path, parent) as (
    select pk, name, p.pk, p.name, level, name::varchar(8192), parent
    from partitions p where p.pk = '110'
    union
    select p2.pk, p2.name, self.leaf_pk, self.leaf_name, p2.level, (p2.name || '/' || self.path)::varchar(8192), p2.parent
    from result self join partitions p2 on p2.pk = self.parent
)
select * from result r;

```

大概会打印如下内容：

| root\_pk | root\_name | leaf\_pk | leaf\_name | root\_level | path | parent |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 110 | dotnet5 | 110 | dotnet5 | 5 | dotnet5 | 109 |
| 109 | dotnet9 | 110 | dotnet5 | 4 | dotnet9/dotnet5 | 108 |
| 108 | dotnet8 | 110 | dotnet5 | 3 | dotnet8/dotnet9/dotnet5 | 107 |
| 107 | dotnet7 | 110 | dotnet5 | 2 | dotnet7/dotnet8/dotnet9/dotnet5 | 106 |
| 106 | dotnet6 | 110 | dotnet5 | 1 | dotnet6/dotnet7/dotnet8/dotnet9/dotnet5 |  |


此时如果需要可以加上where条件，只查询到指定层级的父级节点。
比如只查询到第二级父级节点，可以加上where条件：where root\_level = 2
