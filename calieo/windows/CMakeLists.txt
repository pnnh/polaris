
set(LIB_NAME ${CALIEO_NAME}Windows)

add_library(${LIB_NAME})

file(GLOB_RECURSE LIB_SOURCES
        Native/*.cpp)

target_sources(${LIB_NAME}
        PUBLIC
        ${LIB_SOURCES})

add_dependencies(${LIB_NAME} ${LIB_QUANTUM} ${LIB_TELESCOPE})
target_link_libraries(${LIB_NAME} PRIVATE ${LIB_QUANTUM} ${LIB_TELESCOPE})

# 查找并引用日志库
find_package(spdlog CONFIG REQUIRED)
target_link_libraries(${LIB_NAME} PRIVATE spdlog::spdlog)