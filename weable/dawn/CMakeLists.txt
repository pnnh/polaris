
set(LIB_DAWN ${WEABLE_NAME}Dawn CACHE INTERNAL "LIB_DAWN")

file(GLOB_RECURSE LIB_SOURCES
        models/*.cpp
        business/*.cpp
        services/*.cpp)

add_library(${LIB_DAWN} ${LIB_SOURCES})

# 查找并引用Boost库
find_package(Boost COMPONENTS system thread chrono filesystem url program_options REQUIRED)
target_include_directories(${LIB_DAWN} PRIVATE ${Boost_INCLUDE_DIRS})
target_link_libraries(${LIB_DAWN} PRIVATE ${Boost_LIBRARIES})

# 查找并引用日志库
find_package(spdlog CONFIG REQUIRED)
target_link_libraries(${LIB_DAWN} PRIVATE spdlog::spdlog)

# 查找并引用Markdown解析库
find_package(cmark CONFIG REQUIRED)
target_link_libraries(${LIB_DAWN} PRIVATE cmark::cmark)

# 查找并引用Sqlite解析库
find_package(unofficial-sqlite3 CONFIG REQUIRED)
target_link_libraries(${LIB_DAWN} PRIVATE unofficial::sqlite3::sqlite3)

# 查找并引用yaml-cpp解析库
find_package(yaml-cpp CONFIG REQUIRED)
target_link_libraries(${LIB_DAWN} PRIVATE yaml-cpp::yaml-cpp)

install(TARGETS ${LIB_DAWN}
        BUNDLE DESTINATION .
        RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
        LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR})