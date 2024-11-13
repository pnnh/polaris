
set(LIB_BASE ${PROJECT_NAME})

set(LIB_NAME ${PROJECT_NAME}WebAssembly)
set(LIB_SOURCES
        wasm/wasm.cpp
        wasm/wasm.h)

add_library(${LIB_NAME} STATIC ${LIB_SOURCES})

#add_dependencies(${LIB_NAME} ${LIB_BASE})
#target_link_libraries(${LIB_NAME} PUBLIC ${LIB_BASE})

# 查找并引用日志库
find_package(spdlog CONFIG REQUIRED)
target_link_libraries(${LIB_NAME} PRIVATE spdlog::spdlog)

add_subdirectory(wasm/browser)
add_subdirectory(wasm/server)
