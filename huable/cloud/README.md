个人项目集合，以monorepo的形式管理，每个项目都是一个独立的目录。每个项目都有自己的README.md文件，用于描述项目的相关信息。

| 目录名称 | 项目描述 |
| ------ | ------ |
| huable | huable.xyz主站 |
| galaxy | 持续集成部署和自动化平台 | 
| molecule | dotnet公共组件集合 |
| neutron | golang公共组件集合 |
| polaris | 笔记工具 |
| portal | calieo.xyz主站 |
| proxima | 资源管理器项目 |
| pulsar | 即时通讯项目 |
| quantum | flutter公共组件集合 |
| sirius | 实用小工具站点 |
| stele | javascript公共组件集合 |
| thirdparty | 第三方组件集合 |
| venus | 图片管理工具 |


## 生成native库

```bash
# 配置cmake
cmake --preset macOS
# 生成native库
cmake --build --preset macOS --config Release
# 安装native库到指定目录
cmake --install build/macOS --config Release
```

### 生成Web库

似乎需要将emscripten工具链升级到3.1.55版本以上，否则无法生成typescript定义并且会编译报错
```bash
cmake --preset Web
cmake --build --preset Web --verbose
```

### 生成msbuild库

```bash
# 配置cmake
cmake --preset windows-dotnet
# 生成native库
cmake --build --preset windows-dotnet --target Molecule --verbose
# 安装native库到指定目录
cmake --install build/build
```

### 生成server库

```bash
cmake --preset Linux
cmake --build --preset Linux --target pulsar-server --verbose
```

### 生成common库

```bash
cmake --preset windows
cmake --build --preset windows --target pulsar-common --verbose
cmake --install build/linux
```

### 执行单元测试

```bash
# 配置及构建项目
cmake --preset windows 
cmake --build --preset windows --target pulsar-common-test
# 进入配置目录执行ctest测试命令
cd build/windows
ctest -C Debug
```

Linux下执行

```bash
# 配置及构建项目
cmake --preset linux 
cmake --build --preset linux --verbose
ctest --test-dir build/linux
```


一个.NET 7.0示例项目，再尝试写点东西


### 编译构建

这里target目录定为输出目录

```shell
# 服务端构建
dotnet publish -c Release Polaris.sln
```

## 构建docker镜像

```bash
sudo docker build -t polaris-cloud-server .

# 本地测试运行容器
sudo docker run --env-file=debug/.env -p 8101:8101 polaris-cloud-server

# 镜像打标签
sudo docker tag polaris-cloud-server:latest elarry/polaris-cloud-server:v0.1.0

# 推送镜像（需要先登录）
sudo docker push elarry/polaris-cloud-server:v0.1.0
```