
set(LIB_NAME PolarisBase)
set(LIB_SOURCES
        models/Article.cpp
        models/Article.h
        utils/md5.cc
        utils/md5.h
        utils/mime.cpp
        utils/mime.h
        utils/datetime.cpp
        utils/datetime.h
        utils/query.cpp
        utils/query.h
        utils/uuid.cpp
        utils/uuid.h)

add_library(${LIB_NAME} ${LIB_SOURCES})

# 查找并引用日志库
find_package(spdlog CONFIG REQUIRED)
target_link_libraries(${LIB_NAME} PRIVATE spdlog::spdlog)

# 查找并引用Markdown解析库
find_package(cmark CONFIG REQUIRED)
target_link_libraries(${LIB_NAME} PRIVATE cmark::cmark)

# 查找并引用Sqlite解析库
find_package(unofficial-sqlite3 CONFIG REQUIRED)
target_link_libraries(${LIB_NAME} PRIVATE unofficial::sqlite3::sqlite3)

# 查找并引用CryptoPP解析库
find_package(cryptopp CONFIG REQUIRED)
target_link_libraries(${LIB_NAME} PRIVATE cryptopp::cryptopp)

install(TARGETS ${LIB_NAME}
        BUNDLE DESTINATION .
        RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
        LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR})