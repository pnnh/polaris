
set(LIB_TELESCOPE ${CALIEO_NAME}Telescope CACHE INTERNAL "LIB_TELESCOPE")

file(GLOB_RECURSE LIB_SOURCES
        models/*.cpp
        business/*.cpp
        services/*.cpp)

add_library(${LIB_TELESCOPE} ${LIB_SOURCES})

# 查找并引用Boost库
find_package(Boost COMPONENTS system thread chrono filesystem url program_options REQUIRED)
target_include_directories(${LIB_TELESCOPE} PRIVATE ${Boost_INCLUDE_DIRS})
target_link_libraries(${LIB_TELESCOPE} PRIVATE ${Boost_LIBRARIES})

# 查找并引用日志库
find_package(spdlog CONFIG REQUIRED)
target_link_libraries(${LIB_TELESCOPE} PRIVATE spdlog::spdlog)

# 查找并引用Markdown解析库
find_package(cmark CONFIG REQUIRED)
target_link_libraries(${LIB_TELESCOPE} PRIVATE cmark::cmark)

# 查找并引用Sqlite解析库
find_package(unofficial-sqlite3 CONFIG REQUIRED)
target_link_libraries(${LIB_TELESCOPE} PRIVATE unofficial::sqlite3::sqlite3)

# 查找并引用yaml-cpp解析库
find_package(yaml-cpp CONFIG REQUIRED)
target_link_libraries(${LIB_TELESCOPE} PRIVATE yaml-cpp::yaml-cpp)

install(TARGETS ${LIB_TELESCOPE}
        BUNDLE DESTINATION .
        RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
        LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR})

if (CMAKE_BUILD_TYPE STREQUAL "Debug" AND (LINUX OR APPLE OR WIN32))
    add_subdirectory(tests)
endif ()