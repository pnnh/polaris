---
image: cover.webp
---

## macOS构建

尝试了使用clang-14和gcc-12来构建，都是通过brew命令安装

发现，当使用clang-14时folly无法正常编译，使用gcc-12可以

使用clang-14时如果把C++标准设置为17就可以通过编译，不过得同时将SYSROOT设置为CommandLineTools，不能用xcode自带的

相反的是，如果用gcc-12，则不能设置SYSROOT，否则编译不通过

## 经验总结

### C++引用C头文件

C++引用C头文件时，记得用extern C包裹，写成如下形式，否则编译时会提示符号找不到

```shell
extern "C" {
#include "libMultiMarkdown.h"
}
```

并且，需要引用c头文件的代码放到引用c++头文件的代码之前

### 通过ExternalProject_Add引用外部工程

通过ExternalProject_Add引用外部cmake项目并不算一个好办法。
在ExternalProject_Add中可以完全手写配置和构建命令，似乎能实现任何想要的功能，哪怕第三方库不是使用cmake构建的。

类似如下形式可以实现对第三方库引用：

```cmake
ExternalProject_Add(MultiMarkdown
        PREFIX ${CMAKE_BINARY_DIR}/thirdparty/MultiMarkdown
        GIT_REPOSITORY https://github.com/fletcher/MultiMarkdown-6.git
        GIT_TAG 6.6.0
        CONFIGURE_COMMAND cmake -DCMAKE_INSTALL_PREFIX=output .
        BUILD_COMMAND make
        INSTALL_COMMAND make install)
```

但是小心，其中CONFIGURE_COMMAND、BUILD_COMMAND这些命令无法复用主工程的cmake配置。

如果在主工程中指定CMAKE构建选项类似如下：

```shell
cmake -DCMAKE_OSX_ARCHITECTURES:STRING=x86_64;arm64 \
    -DCMAKE_OSX_SYSROOT:PATH=xxx \ 
    -DCMAKE_INSTALL_PREFIX=build .
```

这些自定义的参数，包括主工程CMakeLists.txt中配置的内容，在ExternalProject_Add中都是无效的，因为它是单独的cmake命令

### 主工程和外部工程使用不同的工具链

当在主工程中修改工具链相关的内容，比如在mac上编译器由clang换成gcc，可能会导致编译失败
好比通过ExternalProject_Add形式引用外部工程，构建过程是独立的，所采用的还是系统默认的工具链
这次就遇到过，主工程编译器设置成了gcc-12，而系统默认的仍是clang-13，导致外部工程里生成的静态文件无法在主工程链接
