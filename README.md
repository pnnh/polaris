polaris项目跨平台公共组件库

## 项目介绍

一个资源管理器项目

## 项目结构

## 编译构建

以macos为例

```bash
# 配置
cmake --preset macos
# 编译
cmake --build
```

## 运行测试

以macos为例

```bash
cd build/macos
ctest -C Debug
```