polaris项目跨平台公共组件库

## 项目介绍

一个资源管理器项目

目录结构说明

```bash
monorepo
	vcpkg.json
	CMakeLists.txt
	quantum     # 基础功能库
	calieo      # 资源管理器项目代号proxima
		CMakeLists.txt
        telescope    # 跨端业务逻辑
		macos
		linux
		windows
		web
		android
		ios
	huable      # 文章笔记项目代号polaris
		CMakeLists.txt 
        starlight       # 跨端业务逻辑
		macos
		linux
		windows
		web
		android
		ios
	weable      # 图片处理项目代号venus
		CMakeLists.txt
        dawn    # 跨端业务逻辑
		macos
		linux
		windows
		web
		android
		ios
```


## 项目结构

### calieo
分布式资源管理器，代号proxima
具有用户账号体系，可为其它应用提供统一认证服务
同时具有类似邮件一样的通讯服务，可以嵌入到其它应用中

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