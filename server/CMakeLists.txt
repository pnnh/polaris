
set(EXE_NAME ${PROJECT_NAME}Server)

add_executable(${EXE_NAME})

file(GLOB_RECURSE EXE_SOURCES
        controllers/*.cpp
        services/*.cpp
        models/*.cpp)

target_sources(${EXE_NAME}
        PUBLIC
        main.cpp
        process.cpp
        process.h
        router.cpp
        router.h
        ${EXE_SOURCES})

add_dependencies(${EXE_NAME} ${PROJECT_NAME})
target_link_libraries(${EXE_NAME} PRIVATE ${PROJECT_NAME})

# 查找并引用Boost库
find_package(Boost COMPONENTS system thread chrono filesystem url REQUIRED)
target_include_directories(${EXE_NAME} PRIVATE ${Boost_INCLUDE_DIRS})
target_link_libraries(${EXE_NAME} PRIVATE ${Boost_LIBRARIES})

# 查找Workflow库，实现HTTP服务
set(WORKFLOW_BUILD_STATIC_RUNTIME ON)
find_library(workflow_lib workflow)
target_link_libraries(${EXE_NAME} PRIVATE ${workflow_lib})

# 查找并引用folly库
#find_package(folly CONFIG REQUIRED)
#target_link_libraries(${EXE_NAME} PRIVATE Folly::folly Folly::folly_deps Folly::follybenchmark Folly::folly_test_util)

# 查找并引用日志库
find_package(spdlog CONFIG REQUIRED)
target_link_libraries(${EXE_NAME} PRIVATE spdlog::spdlog spdlog::spdlog_header_only)

# 查找JSON库
find_package(nlohmann_json CONFIG REQUIRED)
target_link_libraries(${EXE_NAME} PRIVATE nlohmann_json::nlohmann_json)

# 查找并链接模板库
find_package(inja CONFIG REQUIRED)
target_link_libraries(${EXE_NAME} PRIVATE pantor::inja)

# 查找并引用env解析库
find_package(libenvpp CONFIG REQUIRED)
target_link_libraries(${EXE_NAME} PRIVATE libenvpp::libenvpp)

# 查找并引用日期库
find_package(date CONFIG REQUIRED)
target_link_libraries(${EXE_NAME} PRIVATE date::date-tz)

# 拷贝资源文件到二进制目录，方便调试
file(COPY assets DESTINATION ${CMAKE_CURRENT_BINARY_DIR})

# 查找并引用日志库
find_package(spdlog CONFIG REQUIRED)
target_link_libraries(${EXE_NAME} PRIVATE spdlog::spdlog)

# 配置安装内容
install(TARGETS ${EXE_NAME}
        RUNTIME_DEPENDENCY_SET ${EXE_NAME}-dependencies
        DESTINATION lib)
install(RUNTIME_DEPENDENCY_SET ${EXE_NAME}-dependencies)
 