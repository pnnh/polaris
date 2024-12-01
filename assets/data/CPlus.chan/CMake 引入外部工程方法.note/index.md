---
image: cover.jpg
---

### ExternalProject用法

```cmake

include(ExternalProject)

set(MultiMarkdown_ROOT ${CMAKE_BINARY_DIR}/thirdparty/MultiMarkdown)
set(MultiMarkdown_GIT_TAG 6.6.0)  # 指定版本
set(MultiMarkdown_GIT_URL https://github.com/fletcher/MultiMarkdown-6.git)  # 指定git仓库地址
set(MultiMarkdown_CONFIGURE cd ${MultiMarkdown_ROOT}/src/MultiMarkdown-build
        && cmake -DCMAKE_INSTALL_PREFIX=. ${MultiMarkdown_ROOT}/src/MultiMarkdown)  # 指定配置指令（注意此处修改了安装目录，否则默认情况下回安装到系统目录）
set(MultiMarkdown_MAKE cd ${MultiMarkdown_ROOT}/src/MultiMarkdown-build && make)  # 指定编译指令（需要覆盖默认指令，进入我们指定的MultiMarkdown_ROOT目录下）
set(MultiMarkdown_INSTALL cd ${MultiMarkdown_ROOT}/src/MultiMarkdown-build && make install)  # 指定安装指令（需要覆盖默认指令，进入我们指定的MultiMarkdown_ROOT目录下）

ExternalProject_Add(MultiMarkdown
        PREFIX ${MultiMarkdown_ROOT}
        GIT_REPOSITORY ${MultiMarkdown_GIT_URL}
        GIT_TAG ${MultiMarkdown_GIT_TAG}
        CONFIGURE_COMMAND ${MultiMarkdown_CONFIGURE}
        BUILD_COMMAND ${MultiMarkdown_MAKE}
        INSTALL_COMMAND ${MultiMarkdown_INSTALL}
        )

# 指定编译好的静态库文件的路径
#set(MultiMarkdown_LIB ${MultiMarkdown_ROOT}/lib/MultiMarkdown/libMultiMarkdown.a)
set(MultiMarkdown_LIB_DIR ${MultiMarkdown_ROOT}/src/MultiMarkdown-build)
# 指定头文件所在的目录
set(MultiMarkdown_INCLUDE_DIR ${MultiMarkdown_ROOT}/src/MultiMarkdown-build)

message("Rescan0 ${MultiMarkdown_FOUND}")

#if (APPLE)
#    include_directories(${MultiMarkdown_LIB_DIR}/libMultiMarkdown.framework/Headers)
#    link_directories(${MultiMarkdown_LIB_DIR})
#endif ()

include_directories(${MultiMarkdown_ROOT}/src/MultiMarkdown-build/libMultiMarkdown.framework/Headers)
add_library(Markdown STATIC IMPORTED)
set_target_properties(Markdown PROPERTIES
        FRAMEWORK TRUE
        IMPORTED_LOCATION ${MultiMarkdown_ROOT}/src/MultiMarkdown-build/libMultiMarkdown.framework/libMultiMarkdown)


#if (NOT ${MultiMarkdown_FOUND})
#    #rerun cmake in initial build
#    #will update cmakecache/project files on first build
#    #so you may have to reload project after first build
#    message("Rescan1")
#    add_custom_target(Rescan ${CMAKE_COMMAND} ${CMAKE_SOURCE_DIR} DEPENDS MultiMarkdown)
#else ()
#    #Rescan becomes a dummy target after first build
#    #this prevents cmake from rebuilding cache/projects on subsequent builds
#    message("Rescan2")
#    add_custom_target(Rescan)
#endif ()


```

### FetchContent用法

```cmake

include(FetchContent)

set(SPDLOG_GIT_TAG v1.10.0)  # 指定版本
set(SPDLOG_GIT_URL https://github.com/gabime/spdlog.git)  # 指定git仓库地址

FetchContent_Declare(
        spdlog
        GIT_REPOSITORY ${SPDLOG_GIT_URL}
        GIT_TAG ${SPDLOG_GIT_TAG}
)

FetchContent_MakeAvailable(spdlog)
```
