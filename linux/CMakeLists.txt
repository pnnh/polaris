
# 查找并引用Qt库
find_package(
        Qt6
        COMPONENTS Core
        Qml
        Quick
        Gui
        QuickControls2
        Sql
        Widgets
        Network
        Concurrent
        ShaderTools
        Sql
        REQUIRED)

qt_standard_project_setup()

set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

qt_policy(SET QTP0001 NEW)
qt_policy(SET QTP0004 NEW)

set(APP_NAME ${PROJECT_NAME}Linux)

file(GLOB_RECURSE APP_SOURCES
        services/*.cpp)

qt6_add_executable(${APP_NAME} MANUAL_FINALIZATION)
target_sources(${APP_NAME} PUBLIC main.cpp ${APP_SOURCES})

add_dependencies(${APP_NAME} ${PROJECT_NAME}Base ${PROJECT_NAME}Native)
target_link_libraries(${APP_NAME} PRIVATE ${PROJECT_NAME}Base ${PROJECT_NAME}Native)

# 查找并引用日志库
find_package(spdlog CONFIG REQUIRED)
target_link_libraries(${APP_NAME} PRIVATE spdlog::spdlog)

# 查找并引用Markdown解析库
find_package(cmark CONFIG REQUIRED)
target_link_libraries(${APP_NAME} PRIVATE cmark::cmark)

# 查找并引用Sqlite解析库
find_package(unofficial-sqlite3 CONFIG REQUIRED)
target_link_libraries(${APP_NAME} PRIVATE unofficial::sqlite3::sqlite3)

# 查找并引用CryptoPP解析库
#find_package(cryptopp CONFIG REQUIRED)
#target_link_libraries(${APP_NAME} PRIVATE cryptopp::cryptopp)

target_link_libraries(
        ${APP_NAME}
        PRIVATE Qt6::Core
        Qt6::Qml
        Qt6::Quick
        Qt6::Gui
        Qt6::QuickControls2
        Qt6::Widgets
        Qt6::Sql)

include_directories(${CMAKE_CURRENT_SOURCE_DIR}/content/sources)

file(GLOB_RECURSE RELATIVE_PATH ASSETS_SOURCES
        content/*.png
        content/*.svg
        content/*.jpeg
        content/*.webp)

file(GLOB_RECURSE MODEL_SOURCES
        content/*.cpp)

file(GLOB_RECURSE RELATIVE_PATH QUICK_SOURCES
        content/*.qml)

qt6_add_qml_module(
        ${APP_NAME}
        URI
        quick
        VERSION
        1.0
        RESOURCES
        ${ASSETS_SOURCES}
        SOURCES
        ${MODEL_SOURCES}
        QML_FILES
        ${QUICK_SOURCES})

qt6_add_shaders(
        ${APP_NAME}
        "shaders"
        BATCHABLE
        PRECOMPILE
        OPTIMIZED
        PREFIX
        "/"
        FILES
        "content/shaders/rounded.frag"
        "content/shaders/rounded.vert")

install(
        TARGETS ${APP_NAME}
        BUNDLE DESTINATION .
        RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
        LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR})
