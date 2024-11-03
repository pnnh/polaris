cmake_minimum_required(VERSION 3.29)

project(
        polaris-desktop
        VERSION 0.1
        LANGUAGES C CXX)

if (APPLE)
    enable_language(OBJC OBJCXX Swift)
endif ()

# 设置语言标准
set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
if (WIN32)
    set(CMAKE_C_STANDARD 17)
else ()
    set(CMAKE_C_STANDARD 23)
endif ()
set(CMAKE_C_STANDARD_REQUIRED ON)

# 设置开启显示详细的构建过程
set(CMAKE_VERBOSE_MAKEFILE ON)

# 启用测试
enable_testing()

# 查找并设置ccache
find_program(CCACHE_PROGRAM ccache)
if (CCACHE_PROGRAM)
    message(STATUS "Found ccache: ${CCACHE_PROGRAM}")
    set_property(GLOBAL PROPERTY RULE_LAUNCH_COMPILE "${CCACHE_PROGRAM}")
endif ()

# 设置生成clangd compile_commands.json文件，方便和IDE集成
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

include_directories(${CMAKE_CURRENT_SOURCE_DIR})

set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

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
        REQUIRED)

qt_policy(SET QTP0001 NEW)

set(APP_NAME ${PROJECT_NAME})
set(APP_SOURCES
        main.cpp
        models/LibraryModel.cpp
        models/LibraryModel.h
        models/ImageModel.cpp
        models/ImageModel.h
        services/SqliteService.cpp
        services/SqliteService.h
        services/MarkdownService.cpp
        services/MarkdownService.h
        tests/tests.h
        tests/tests.cpp
        services/UserService.cpp
        services/UserService.h
        services/SyncService.cpp
        services/SyncService.h
        services/imageservice.cpp
        services/imageservice.h
        services/LibraryService.cpp
        services/LibraryService.h
        services/FolderService.h
        services/FolderService.cpp
        threads/SyncThread.cpp
        threads/SyncThread.h
        utils/base32.cpp
        utils/base32.h
        utils/mime.h
        utils/mime.cpp)

if (APPLE)
    # list(APPEND APPLICATION_LIBRARIES "-framework AppKit") list(APPEND
    # APPLICATION_SOURCES macos/macwindow.h macos/macwindow.mm macos/objc_code.mm
    # macos/objc_code.h macos/WindowController.mm macos/WindowController.h)

    set(MACOSX_BUNDLE_GUI_IDENTIFIER ${IDENTIFIER})
    set(MACOSX_BUNDLE_BUNDLE_NAME ${PROJECT_NAME})
    set(MACOSX_BUNDLE_COPYRIGHT ${COPYRIGHT})
    set(MACOSX_BUNDLE_SHORT_VERSION_STRING ${spectral_VERSION})
    set(MACOSX_BUNDLE_BUNDLE_VERSION ${spectral_VERSION})
    set(ICON_NAME "icon.icns")
    set(APP_MAC_ICON "${PROJECT_SOURCE_DIR}/content/assets/macos/${ICON_NAME}")
    list(APPEND APP_SOURCES ${APP_MAC_ICON})
    set(MACOSX_BUNDLE_ICON_FILE ${ICON_NAME})
    set_property(SOURCE "${APP_MAC_ICON}" PROPERTY MACOSX_PACKAGE_LOCATION
            Resources)
endif ()

qt6_add_executable(${APP_NAME} WIN32 MACOSX_BUNDLE MANUAL_FINALIZATION
        ${APP_SOURCES})

if (APPLE)
    set_target_properties(
            ${APP_NAME}
            PROPERTIES MACOSX_BUNDLE_INFO_PLIST
            "${PROJECT_SOURCE_DIR}/content/assets/macos/Info.plist.in")
endif ()

# 查找并引用日志库
find_package(spdlog CONFIG REQUIRED)
target_link_libraries(${APP_NAME} PRIVATE spdlog::spdlog)

# 查找并引用Markdown解析库
find_package(cmark CONFIG REQUIRED)
target_link_libraries(${APP_NAME} PRIVATE cmark::cmark_static)

# 查找并引用Sqlite解析库
find_package(unofficial-sqlite3 CONFIG REQUIRED)
target_link_libraries(${APP_NAME} PRIVATE unofficial::sqlite3::sqlite3)

# 查找并引用CryptoPP解析库
find_package(cryptopp CONFIG REQUIRED)
target_link_libraries(${APP_NAME} PRIVATE cryptopp::cryptopp)

target_link_libraries(
        ${APP_NAME}
        PRIVATE Qt6::Core
        Qt6::Qml
        Qt6::Quick
        Qt6::Gui
        Qt6::QuickControls2
        Qt6::Sql
        Qt6::Widgets
        Qt6::Network
        Qt6::Concurrent)

include_directories(${CMAKE_CURRENT_SOURCE_DIR}/content/sources)

qt6_add_qml_module(
        ${APP_NAME}
        URI
        quick
        VERSION
        1.0
        RESOURCES
        content/assets/images/flag-fill.png
        content/assets/images/logo.png
        content/assets/images/files.svg
        content/assets/photos/photo1.webp
        content/assets/photos/photo2.jpeg
        content/assets/material/symbols/web/description/description_48px.svg
        content/assets/material/symbols/web/description/description_fill1_48px.svg
        content/assets/material/symbols/web/keyboard_arrow_down/keyboard_arrow_down_48px.svg
        content/assets/material/symbols/web/keyboard_arrow_down/keyboard_arrow_down_fill1_48px.svg
        content/assets/material/symbols/web/book_2/book_2_48px.svg
        content/assets/material/symbols/web/book_2/book_2_fill1_48px.svg
        content/assets/material/symbols/web/imagesmode/imagesmode_48px.svg
        content/assets/material/symbols/web/imagesmode/imagesmode_fill1_48px.svg
        content/assets/material/symbols/web/photo_library/photo_library_48px.svg
        content/assets/material/symbols/web/photo_library/photo_library_fill1_48px.svg
        content/assets/material/symbols/web/library_books/library_books_48px.svg
        content/assets/material/symbols/web/library_books/library_books_fill1_48px.svg
        content/assets/material/symbols/web/image_search/image_search_48px.svg
        content/assets/material/symbols/web/image_search/image_search_fill1_48px.svg
        content/assets/material/symbols/web/mail/mail_48px.svg
        content/assets/material/symbols/web/mail/mail_fill1_48px.svg
        content/assets/material/symbols/chevron_right_24dp_FILL.svg
        SOURCES
        content/sources/markdown.h
        content/sources/markdown.cpp
        content/sources/PartitionViewModel.h
        content/sources/PartitionViewModel.cpp
        content/sources/LibraryViewModel.h
        content/sources/LibraryViewModel.cpp
        content/sources/PictureLocationViewModel.h
        content/sources/PictureLocationViewModel.cpp
        content/sources/PictureGridModel.h
        content/sources/PictureGridModel.cpp
        content/sources/SAChannelViewModel.h
        content/sources/SAChannelViewModel.cpp
        content/sources/SASessionListViewModel.h
        content/sources/SASessionListViewModel.cpp
        QML_FILES
        content/Main.qml
        content/App.qml
        content/Users.qml
        content/Profiles.qml
        content/Topbar.qml
        content/FxScrollBar.qml
        content/TaskList.qml
        content/NavList.qml
        content/polaris/Editor.qml
        content/polaris/Sidebar.qml
        content/polaris/LibraryItem.qml
        content/polaris/PartitionItem.qml
        content/polaris/Navbar.qml
        content/polaris/Page.qml
        content/venus/Navbar.qml
        content/venus/LibraryPage.qml
        content/venus/BrowserPage.qml
        content/venus/Sidebar.qml
        content/venus/Location.qml
        content/venus/LibraryItem.qml
        content/venus/PartitionItem.qml
        content/venus/PictureGrid.qml
        content/pulsar/Page.qml
        content/pulsar/ChannelList.qml
        content/pulsar/SessionList.qml)

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

add_test(NAME ${APP_NAME}-case COMMAND ${APP_NAME} sqlite)
set_tests_properties(${APP_NAME}-case PROPERTIES ENVIRONMENT PL_DSN=xyz)

add_test(NAME polaris-tests-markdown COMMAND ${APP_NAME} markdown)
