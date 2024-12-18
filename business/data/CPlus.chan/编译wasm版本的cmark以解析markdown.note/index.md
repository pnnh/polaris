---
image: cover.jpg
---


首先下载cmark源码，然后按需要切换到特定版本，这里使用0.30.3版本。

```shell

# 下载cmark源码
git clone https://github.com/commonmark/cmark.git
# 切换到特定版本版本
cd cmark && git checkout 0.30.3


```

然后编译cmark源码，生成cmark的wasm版本。

> 需要预先安装cmake、emscripten等工具。

```shell
# 创建并进入编译目录
make build-wasm && cd build-wasm
# 执行cmake配置命令，同时指定emscripten工具链（记得修改为自己本地安装的emscripten目录）
cmake -DCMAKE_TOOLCHAIN_FILE=~/Applications/emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake ..
# 编译cmark
make
```

编译完成后，会在build-wasm目录下生成cmark.js和cmark.wasm文件。