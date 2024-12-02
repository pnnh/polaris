
set(EXE_NAME ${GLOBAL_LIB_PREFIX}Pulsar)

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
        ${EXE_SOURCES} ${GLOBAL_QUANTUM_SOURCES})

message(STATUS "EXE_SOURCES: ${GLOBAL_QUANTUM_SOURCES}")

# 查找并引用Boost库
find_package(Boost COMPONENTS system thread chrono filesystem url REQUIRED)
target_include_directories(${EXE_NAME} PRIVATE ${Boost_INCLUDE_DIRS})
target_link_libraries(${EXE_NAME} PRIVATE ${Boost_LIBRARIES})

# 查找Workflow库，实现HTTP服务
set(WORKFLOW_BUILD_STATIC_RUNTIME ON)
find_library(workflow_lib workflow)
target_link_libraries(${EXE_NAME} PRIVATE ${workflow_lib})

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

# 查找并引用Sqlite解析库
find_package(unofficial-sqlite3 CONFIG REQUIRED)
target_link_libraries(${EXE_NAME} PRIVATE unofficial::sqlite3::sqlite3)

# 查找并引用yaml-cpp解析库
find_package(yaml-cpp CONFIG REQUIRED)
target_link_libraries(${EXE_NAME} PRIVATE yaml-cpp::yaml-cpp)

# 查找并引用Markdown解析库
find_package(cmark CONFIG REQUIRED)
target_link_libraries(${EXE_NAME} PRIVATE cmark::cmark)

# 拷贝资源文件到二进制目录，方便调试
#file(COPY assets DESTINATION ${CMAKE_CURRENT_BINARY_DIR})
#
## 配置安装内容
#install(TARGETS ${EXE_NAME}
#        RUNTIME_DEPENDENCY_SET ${EXE_NAME}-dependencies
#        DESTINATION lib)
#install(RUNTIME_DEPENDENCY_SET ${EXE_NAME}-dependencies)
 