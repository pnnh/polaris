cmake_minimum_required(VERSION 3.29)

project(PolarisNative VERSION 0.1.0 LANGUAGES C CXX)

if (APPLE)
    enable_language(OBJC OBJCXX Swift)
endif ()

# 设置语言标准
set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
if (WIN32)
    set(CMAKE_C_STANDARD 17)
    if(NOT CMAKE_SIZEOF_VOID_P)
        set(CMAKE_SIZEOF_VOID_P 8) # 不添加的话cmake会配置失败
    endif()
else ()
    set(CMAKE_C_STANDARD 23)
endif ()
set(CMAKE_C_STANDARD_REQUIRED ON)

# 设置开启显示详细的构建过程
set(CMAKE_VERBOSE_MAKEFILE ON)

# 启用测试
enable_testing()

# 查找并设置ccache
find_program(CCACHE_PROGRAM ccache)
if (CCACHE_PROGRAM)
    set_property(GLOBAL PROPERTY RULE_LAUNCH_COMPILE "${CCACHE_PROGRAM}")
endif ()

# 设置生成clangd compile_commands.json文件，方便和IDE集成
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

include_directories(${CMAKE_CURRENT_SOURCE_DIR})

# 避免警告
CMAKE_POLICY(SET CMP0012 NEW)

add_subdirectory(base)
if (WIN32)
    add_subdirectory(windows)
elseif(APPLE)
    # add_subdirectory(macos)

    #include_directories(${CMAKE_CURRENT_SOURCE_DIR}/Native)

    set(LIB_BASE PolarisBase)

    set(LIB_NAME PolarisMacos)
    set(LIB_SOURCES
            Native/logger/logger.h
            Native/logger/logger.cpp
            Native/module.modulemap)

    # 添加静态库（macOS下不支持动态链接）
    add_library(${LIB_NAME} ${LIB_SOURCES})

    #add_dependencies(${LIB_NAME} ${LIB_BASE})
    #target_link_libraries(${LIB_NAME} PRIVATE ${LIB_BASE})

    # 查找并引用日志库
    find_package(spdlog CONFIG REQUIRED)
    target_link_libraries(${LIB_NAME} PRIVATE spdlog::spdlog)
elseif(LINUX)
    add_subdirectory(kde)
    add_subdirectory(server)
endif()