cmake_minimum_required(VERSION 3.28)

project(Polaris VERSION 0.1.0 LANGUAGES C CXX)

if (APPLE)
    enable_language(OBJC OBJCXX Swift)
endif ()

# 设置语言标准
set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
if (WIN32)
    set(CMAKE_C_STANDARD 17)
    if (NOT CMAKE_SIZEOF_VOID_P)
        set(CMAKE_SIZEOF_VOID_P 8) # 不添加的话cmake会配置失败
    endif ()
else ()
    set(CMAKE_C_STANDARD 23)
endif ()
set(CMAKE_C_STANDARD_REQUIRED ON)

# 设置开启显示详细的构建过程
set(CMAKE_VERBOSE_MAKEFILE ON)

# 启用测试
enable_testing()

include_directories(${CMAKE_CURRENT_SOURCE_DIR})

# 避免警告
CMAKE_POLICY(SET CMP0012 NEW)

add_subdirectory(native)
if (WIN32)
    add_subdirectory(windows)
elseif (APPLE)
    add_subdirectory(macos)
elseif (LINUX)
    add_subdirectory(server)
    if (CMAKE_SYSTEM_PROCESSOR MATCHES "x86_64")
        add_subdirectory(linux)
    endif ()
endif ()