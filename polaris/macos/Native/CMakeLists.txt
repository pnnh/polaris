cmake_minimum_required(VERSION 3.28)

project(Native VERSION 0.1 LANGUAGES C CXX)

enable_language(OBJC OBJCXX Swift)

# 设置语言标准
set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_C_STANDARD 23)
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

set(LIB_NAME ${PROJECT_NAME})
set(LIB_SOURCES 
logger/logger.h
logger/logger.cpp
module.modulemap)

# list(APPEND APPLICATION_LIBRARIES "-framework AppKit") list(APPEND
# APPLICATION_SOURCES macos/macwindow.h macos/macwindow.mm macos/objc_code.mm
# macos/objc_code.h macos/WindowController.mm macos/WindowController.h)

# set(MACOSX_BUNDLE_GUI_IDENTIFIER ${IDENTIFIER})
# set(MACOSX_BUNDLE_BUNDLE_NAME ${PROJECT_NAME})
# set(MACOSX_BUNDLE_COPYRIGHT ${COPYRIGHT})
# set(MACOSX_BUNDLE_SHORT_VERSION_STRING ${spectral_VERSION})
# set(MACOSX_BUNDLE_BUNDLE_VERSION ${spectral_VERSION})

# 添加静态库（macOS下不支持动态链接）
add_library(${LIB_NAME} ${LIB_SOURCES})

# 查找并引用日志库
find_package(spdlog CONFIG REQUIRED)
target_link_libraries(${LIB_NAME} PRIVATE spdlog::spdlog)


# 添加测试执行程序
set(TEST_NAME ${LIB_NAME}Test)

add_executable(${TEST_NAME} test.cpp)
add_dependencies(${TEST_NAME} ${LIB_NAME})
target_link_libraries(${TEST_NAME} PRIVATE ${LIB_NAME})

add_test(NAME Test COMMAND ${TEST_NAME})
