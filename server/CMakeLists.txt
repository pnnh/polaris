add_executable(pulsar-server
    main.cpp
    tests/tests.h
    tests/tests.cpp
    process.cpp
    process.h
    router.cpp
    router.h
    controllers/article.cpp
    controllers/article.h
    controllers/sitemap.cpp
    controllers/sitemap.h
    models/codes.cpp
    models/codes.h
    models/article.cpp
    models/article.h
    services/config/appconfig.cpp
    services/config/appconfig.h
    services/business/article.cpp
    services/business/article.h)
    
add_dependencies(pulsar-server pulsar-modules)
target_link_libraries(pulsar-server PRIVATE pulsar-modules)

# 查找并引用Boost库
find_package(Boost COMPONENTS system thread chrono filesystem url REQUIRED) 
target_include_directories(pulsar-server PRIVATE ${Boost_INCLUDE_DIRS})
target_link_libraries(pulsar-server PRIVATE ${Boost_LIBRARIES})

# 查找Workflow库，实现HTTP服务
set(WORKFLOW_BUILD_STATIC_RUNTIME ON)
find_library(workflow_lib workflow)
target_link_libraries(pulsar-server PRIVATE ${workflow_lib})

# 查找并引用folly库
find_package(folly CONFIG REQUIRED)
target_link_libraries(pulsar-server PRIVATE Folly::folly Folly::folly_deps Folly::follybenchmark Folly::folly_test_util)

# 查找并引用Postgresql库
find_package(libpqxx CONFIG REQUIRED)
target_link_libraries(pulsar-server PRIVATE libpqxx::pqxx)
# find_library(libpq pq)
# message(STATUS "libpq: ${libpq}")
# target_link_libraries(pulsar-server PRIVATE ${libpq})

# find_library(libpqxx pqxx)
# message(STATUS "libpqxx: ${libpqxx}")
# target_link_libraries(pulsar-server PRIVATE ${libpqxx})


# 查找并引用日志库
find_package(spdlog CONFIG REQUIRED)
target_link_libraries(pulsar-server PRIVATE spdlog::spdlog spdlog::spdlog_header_only)

# 查找JSON库
find_package(nlohmann_json CONFIG REQUIRED)
target_link_libraries(pulsar-server PRIVATE nlohmann_json::nlohmann_json)

# 查找并链接模板库
find_package(inja CONFIG REQUIRED)
target_link_libraries(pulsar-server PRIVATE pantor::inja)

# 查找并引用env解析库
find_package(libenvpp CONFIG REQUIRED)
target_link_libraries(pulsar-server PRIVATE libenvpp::libenvpp)

# 查找并引用日期库
find_package(date CONFIG REQUIRED)
target_link_libraries(pulsar-server PRIVATE date::date-tz)

# 拷贝资源文件到二进制目录，方便调试
file(COPY assets DESTINATION ${CMAKE_CURRENT_BINARY_DIR})

# 查找并引用日志库
find_package(spdlog CONFIG REQUIRED)
target_link_libraries(pulsar-server PRIVATE spdlog::spdlog)

# 引用公共库
target_link_libraries(pulsar-server PRIVATE pulsar-common)

# 配置安装内容
install(TARGETS pulsar-server
        RUNTIME_DEPENDENCY_SET pulsar-server-dependencies
        DESTINATION lib)
install(RUNTIME_DEPENDENCY_SET pulsar-server-dependencies)

# 添加测试用例
add_test(NAME pulsar-tests-md5 COMMAND pulsar-server md5)
add_test(NAME pulsar-tests-dsn COMMAND pulsar-server dsn)
set_tests_properties(pulsar-tests-dsn PROPERTIES ENVIRONMENT PL_DSN=xyz)