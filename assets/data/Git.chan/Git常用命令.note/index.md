---
image: cover.jpg
---

Git常用命令列表

### 子模块

```shell
# 递归同步子模块
git submodule sync —recursive 

# 递归初始化子模块
git submodule update --init —recursive
```

移除Git子模块的步骤

```shell
# 移除.git/config配置文件中的子模块配置
git submodule deinit -f path/to/submodule

# 移除.git/modules下的子模块目录
rm -rf .git/modules/path/to/submodule

# 移除.gitmodules文件中的子模块配置，并移除path/to/submodule目录
git rm -f path/to/submodule
```

### 特殊操作

```shell
# 获取当前分支的修订版本号
git rev-parse HEAD

# 强制撤销本地修改
git reset --hard
```

