cmake_minimum_required(VERSION 3.28...3.31)

project(Multiverse VERSION 0.1.0 LANGUAGES C CXX)

if (APPLE)
    enable_language(Swift)
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
include_directories(${PROJECT_BINARY_DIR})

# 避免警告
if (POLICY CMP0012)
    cmake_policy(SET CMP0012 NEW)
endif ()
# 针对CMake 3.30版本Boost查找相关警告
if (POLICY CMP0167)
    cmake_policy(SET CMP0167 NEW)
endif ()
set(Boost_USE_STATIC_LIBS   ON)
set(Boost_USE_MULTITHREADED ON)

add_subdirectory(galaxy/quantum)
add_subdirectory(galaxy/neutron)
add_subdirectory(calieo)
add_subdirectory(huable)
add_subdirectory(weable)