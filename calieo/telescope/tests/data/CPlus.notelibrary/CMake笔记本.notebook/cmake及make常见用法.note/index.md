### 生成ninja构建规则

```shell
mkdir build && cd build
# cmake配置，生成ninja构建规则
cmake -DCMAKE_BUILD_TYPE=Release -G Ninja -DCMAKE_INSTALL_PREFIX=/opt ..
# 或者安装到构建产物所在目录
cmake -DCMAKE_BUILD_TYPE=Release -G Ninja -DCMAKE_INSTALL_PREFIX=target ..
# 执行构建
nijja
# 执行安装
ninja install
```

### 生成clangd可以识别的编译配置文件

```shell
# 在CMakeLists.txt所在目录下创建build目录并进入
mkdir build && cd build
# 会在build目录生成compile_commands.json文件
cmake -DCMAKE_PREFIX_PATH=~/Qt/6.3.1/macos/lib/cmake -DCMAKE_EXPORT_COMPILE_COMMANDS=1 ..
```
生成后可以在emacs下搭配eglot和company使用


### 卸载

执行make install 或者 ninja install只会会生成install_manifest.txt文件，包含安装的文件列表。可以通过这个文件来执行卸载操作。
不过实际操作起来比较麻烦，需要解析该文件并手动执行删除。

```shell
# 执行以下命令依据install_manifest.txt文件来删除make install命令安装的文件
# 不过该命令只能删除文件，无法删除文件夹
xargs rm < install_manifest.txt
```

### 运行时库文件查找目录

通过设置LD_LIBRARY_PATH环境变量来使得自己安装的库文件能够被查找到

```shell
export LD_LIBRARY_PATH=/opt/lib:$LD_LIBRARY_PATH
```

### CmakePresets

```shell
# 通过preset构建
cmake --build --preset default
```

### 设置安装目标，及目标依赖库

```cmake
install(TARGETS kepler
RUNTIME_DEPENDENCY_SET kepler_dependencies)
install(RUNTIME_DEPENDENCY_SET kepler_dependencies)
```
