cmake_minimum_required(VERSION 3.29)

project(polaris-native VERSION 0.1.0 LANGUAGES C CXX)

# 设置语言标准
set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
if (WIN32)
    set(CMAKE_C_STANDARD 17)
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

set(APP_NAME ${PROJECT_NAME})
set(APP_SOURCES
        main.cpp
        models/LibraryModel.cpp
        models/LibraryModel.h
        models/ImageModel.cpp
        models/ImageModel.h
        services/SqliteService.cpp
        services/SqliteService.h
        services/MarkdownService.cpp
        services/MarkdownService.h
        tests/tests.h
        tests/tests.cpp
        services/UserService.cpp
        services/UserService.h
        services/SyncService.cpp
        services/SyncService.h
        services/imageservice.cpp
        services/imageservice.h
        services/LibraryService.cpp
        services/LibraryService.h
        services/FolderService.h
        services/FolderService.cpp
        threads/SyncThread.cpp
        threads/SyncThread.h
        utils/base32.cpp
        utils/base32.h
        utils/mime.h
        utils/mime.cpp)

add_executable(${APP_NAME} WIN32 MACOSX_BUNDLE ${APP_SOURCES})

# 查找并引用日志库
find_package(spdlog CONFIG REQUIRED)
target_link_libraries(${APP_NAME} PRIVATE spdlog::spdlog)

# 查找并引用Markdown解析库
find_package(cmark CONFIG REQUIRED)
target_link_libraries(${APP_NAME} PRIVATE cmark::cmark)

# 查找并引用Sqlite解析库
find_package(unofficial-sqlite3 CONFIG REQUIRED)
target_link_libraries(${APP_NAME} PRIVATE unofficial::sqlite3::sqlite3)

# 查找并引用CryptoPP解析库
find_package(cryptopp CONFIG REQUIRED)
target_link_libraries(${APP_NAME} PRIVATE cryptopp::cryptopp)

include_directories(${CMAKE_CURRENT_SOURCE_DIR}/content/sources)

install(
        TARGETS ${APP_NAME}
        BUNDLE DESTINATION .
        RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
        LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR})

add_test(NAME ${APP_NAME}-case COMMAND ${APP_NAME} sqlite)
set_tests_properties(${APP_NAME}-case PROPERTIES ENVIRONMENT PL_DSN=xyz)

add_test(NAME polaris-tests-markdown COMMAND ${APP_NAME} markdown)
