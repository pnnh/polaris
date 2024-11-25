---
image: cover.webp
---


```shell
# 配置并设置安装目录
cmake -DCMAKE_INSTALL_PREFIX=install ..
# 安装
cmake --install target --prefix install
# 使用制定配置安装到指定目录
cmake --install target --config Release --prefix install
```

## macOS下采用CMakePresets构建

```shell
# 配置
cmake --preset macOS
# 编译
cmake --build --preset macOS --config Release
# 安装
cmake --install output/macos --config Release --prefix install
```
