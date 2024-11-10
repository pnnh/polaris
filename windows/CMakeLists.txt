
set(LIB_BASE ${PROJECT_NAME})

set(LIB_NAME ${PROJECT_NAME}Windows)
set(LIB_SOURCES
        Native/logger/logger.h
        Native/logger/logger.cpp)

add_library(${LIB_NAME} ${LIB_SOURCES})

add_dependencies(${LIB_NAME} ${LIB_BASE})
target_link_libraries(${LIB_NAME} PRIVATE ${LIB_BASE})

# 查找并引用日志库
find_package(spdlog CONFIG REQUIRED)
target_link_libraries(${LIB_NAME} PRIVATE spdlog::spdlog)