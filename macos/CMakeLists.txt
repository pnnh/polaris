
#include_directories(${CMAKE_CURRENT_SOURCE_DIR}/Native)

set(LIB_BASE ${PROJECT_NAME})

set(LIB_NAME PolarisMacos)
set(LIB_SOURCES
        Native/logger/logger.h
        Native/logger/logger.cpp
        Native/module.modulemap)

# 添加静态库（macOS下不支持动态链接）
add_library(${LIB_NAME} ${LIB_SOURCES})

#add_dependencies(${LIB_NAME} ${LIB_BASE})
#target_link_libraries(${LIB_NAME} PRIVATE ${LIB_BASE})

# 查找并引用日志库
find_package(spdlog CONFIG REQUIRED)
target_link_libraries(${LIB_NAME} PRIVATE spdlog::spdlog)

#set_target_properties(${LIB_NAME} PROPERTIES
#        FRAMEWORK TRUE
#        FRAMEWORK_VERSION C
#        MACOSX_FRAMEWORK_IDENTIFIER xyz.calieo.PolarisMacos
#        VERSION ${spectral_VERSION}
#        SOVERSION ${spectral_VERSION}
#        PUBLIC_HEADER PolarisMacos.h
#        XCODE_ATTRIBUTE_CODE_SIGN_IDENTITY "Apple Development")