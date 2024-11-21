
set(LIB_NAME ${PROJECT_NAME}Base)

file(GLOB_RECURSE LIB_SOURCES
        types/*.cpp
        utils/*.cpp
        services/*.cpp)

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