
set(LIB_NAME ${PROJECT_NAME})

file(GLOB_RECURSE LIB_SOURCES
        models/*.cpp
        business/*.cpp
        utils/*.cpp
        services/*.cpp
        business/*.cpp)

#set(LIB_SOURCES
#        models/articles/Article.cpp
#        models/articles/Article.h
#        models/articles/Channel.cpp
#        models/articles/Channel.h
#        models/pictures/Picture.cpp
#        models/pictures/Picture.h
#        models/files/File.cpp
#        models/files/File.h
#        models/protocol/Exception.cpp
#        models/protocol/Exception.h
#        models/protocol/Codes.cpp
#        models/protocol/Codes.h
#        models/protocol/CommonResult.cpp
#        models/protocol/CommonResult.h
#        business/articles/article.cpp
#        business/articles/article.h
#        business/articles/channel.cpp
#        business/articles/channel.h
#        business/pictures/picture.cpp
#        business/pictures/picture.h
#        business/pictures/channel.cpp
#        business/pictures/channel.h
#        business/articles/library.cpp
#        business/articles/library.h
#        utils/md5.cc
#        utils/md5.h
#        utils/mime.cpp
#        utils/mime.h
#        utils/datetime.cpp
#        utils/datetime.h
#        utils/query.cpp
#        utils/query.h
#        utils/uuid.cpp
#        utils/uuid.h
#        utils/StringUtils.cpp
#        utils/StringUtils.h
#        utils/EnumUtils.cpp
#        utils/EnumUtils.h
#        utils/basex.cpp
#        utils/basex.h
#        services/sqlite/SqliteResult.cpp
#        services/sqlite/SqliteResult.h
#        services/sqlite/SqliteRow.cpp
#        services/sqlite/SqliteRow.h
#        services/sqlite/SqliteColumn.cpp
#        services/sqlite/SqliteColumn.h
#        services/sqlite/SqliteService.cpp
#        services/sqlite/SqliteService.h
#        services/filesystem/filesystem.cpp
#        services/filesystem/filesystem.h
#        services/logger/logger.cpp
#        services/logger/logger.h
#        services/yaml/yaml.cpp
#        services/yaml/yaml.h
#        services/markdown/MarkdownService.h
#        services/markdown/MarkdownService.cpp
#        models/articles/Library.cpp
#        models/articles/Library.h
#        business/articles/notebook.cpp
#        business/articles/notebook.h
#        models/articles/Notebook.cpp
#        models/articles/Notebook.h)

add_library(${LIB_NAME} ${LIB_SOURCES})

configure_file("build.h.in" "${PROJECT_BINARY_DIR}/build.h")

# 查找并引用Boost库
find_package(Boost COMPONENTS system thread chrono filesystem url program_options REQUIRED)
target_include_directories(${LIB_NAME} PRIVATE ${Boost_INCLUDE_DIRS})
target_link_libraries(${LIB_NAME} PRIVATE ${Boost_LIBRARIES})

# 查找并引用日志库
find_package(spdlog CONFIG REQUIRED)
target_link_libraries(${LIB_NAME} PRIVATE spdlog::spdlog)

# 查找并引用Markdown解析库
find_package(cmark CONFIG REQUIRED)
target_link_libraries(${LIB_NAME} PRIVATE cmark::cmark)

# 查找并引用Sqlite解析库
find_package(unofficial-sqlite3 CONFIG REQUIRED)
target_link_libraries(${LIB_NAME} PRIVATE unofficial::sqlite3::sqlite3)

# 查找并引用yaml-cpp解析库
find_package(yaml-cpp CONFIG REQUIRED)
target_link_libraries(${LIB_NAME} PRIVATE yaml-cpp::yaml-cpp)

install(TARGETS ${LIB_NAME}
        BUNDLE DESTINATION .
        RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
        LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR})

if (CMAKE_BUILD_TYPE STREQUAL "Debug" AND (LINUX OR APPLE OR WIN32))
    add_subdirectory(examples)
endif ()