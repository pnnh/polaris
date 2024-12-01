cmake_minimum_required(VERSION 3.28)

project(Native VERSION 0.1 LANGUAGES CXX)

# 设置语言标准
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 设置开启显示详细的构建过程
set(CMAKE_VERBOSE_MAKEFILE ON)

include_directories(${CMAKE_CURRENT_SOURCE_DIR})

set(LIB_NAME ${PROJECT_NAME})
set(LIB_SOURCES 
    logger/logger.h
    logger/logger.cpp
    module.modulemap)

# 添加静态库
add_library(${LIB_NAME} ${LIB_SOURCES})

# 查找并引用日志库
find_package(spdlog CONFIG REQUIRED)
target_link_libraries(${LIB_NAME} PRIVATE spdlog::spdlog)

# 添加可选的测试程序
set(TEST_EXE ${LIB_NAME}Test)
add_executable(${TEST_EXE} test.cpp)
add_dependencies(${TEST_EXE} ${LIB_NAME})
target_link_libraries(${TEST_EXE} PRIVATE ${LIB_NAME})
