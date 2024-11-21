cmake_minimum_required(VERSION 3.28)

project(Polaris VERSION 0.1.0 LANGUAGES C CXX)

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
CMAKE_POLICY(SET CMP0012 NEW)

add_subdirectory(base)
add_subdirectory(native)

if (CMAKE_BUILD_TYPE STREQUAL "Debug" AND (LINUX OR APPLE OR WIN32))
    add_subdirectory(examples)
endif ()

message(STATUS "VCPKG_TARGET_TRIPLET: ${VCPKG_TARGET_TRIPLET}")
if (VCPKG_TARGET_TRIPLET STREQUAL "x64-windows")
    add_subdirectory(windows)
    add_subdirectory(linux)
    add_subdirectory(server)
elseif (VCPKG_TARGET_TRIPLET STREQUAL "arm64-osx")
    add_subdirectory(macos)
    add_subdirectory(linux)
    add_subdirectory(server)
elseif (EMSCRIPTEN)
    add_subdirectory(web)
elseif (LINUX)
    add_subdirectory(linux)
    add_subdirectory(server)
endif ()