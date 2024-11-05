add_executable(polaris-server
    main.cpp
    process.cpp
    process.h
    router.cpp
    router.h
    controllers/article.cpp
    controllers/article.h
    controllers/sitemap.cpp
    controllers/sitemap.h
    models/common_result.cpp
    models/common_result.h
    models/codes.cpp
    models/codes.h
    models/article.cpp
    models/article.h
    services/config/appconfig.cpp
    services/config/appconfig.h
        controllers/index.cpp
        controllers/index.h)
    
add_dependencies(polaris-server PolarisBase)
target_link_libraries(polaris-server PRIVATE PolarisBase)

# 查找并引用Boost库
find_package(Boost COMPONENTS system thread chrono filesystem url REQUIRED) 
target_include_directories(polaris-server PRIVATE ${Boost_INCLUDE_DIRS})
target_link_libraries(polaris-server PRIVATE ${Boost_LIBRARIES})

# 查找Workflow库，实现HTTP服务
set(WORKFLOW_BUILD_STATIC_RUNTIME ON)
find_library(workflow_lib workflow)
target_link_libraries(polaris-server PRIVATE ${workflow_lib})

# 查找并引用folly库
find_package(folly CONFIG REQUIRED)
target_link_libraries(polaris-server PRIVATE Folly::folly Folly::folly_deps Folly::follybenchmark Folly::folly_test_util)

# 查找并引用日志库
find_package(spdlog CONFIG REQUIRED)
target_link_libraries(polaris-server PRIVATE spdlog::spdlog spdlog::spdlog_header_only)

# 查找JSON库
find_package(nlohmann_json CONFIG REQUIRED)
target_link_libraries(polaris-server PRIVATE nlohmann_json::nlohmann_json)

# 查找并链接模板库
find_package(inja CONFIG REQUIRED)
target_link_libraries(polaris-server PRIVATE pantor::inja)

# 查找并引用env解析库
find_package(libenvpp CONFIG REQUIRED)
target_link_libraries(polaris-server PRIVATE libenvpp::libenvpp)

# 查找并引用日期库
find_package(date CONFIG REQUIRED)
target_link_libraries(polaris-server PRIVATE date::date-tz)

# 拷贝资源文件到二进制目录，方便调试
file(COPY assets DESTINATION ${CMAKE_CURRENT_BINARY_DIR})

# 查找并引用日志库
find_package(spdlog CONFIG REQUIRED)
target_link_libraries(polaris-server PRIVATE spdlog::spdlog)

# 配置安装内容
install(TARGETS polaris-server
        RUNTIME_DEPENDENCY_SET polaris-server-dependencies
        DESTINATION lib)
install(RUNTIME_DEPENDENCY_SET polaris-server-dependencies)