

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

set(APP_SOURCES
        main.cxx
        services/sqlite/sqlite.cpp
        services/sqlite/sqlite.h
        services/threads/SyncThread.cpp
        services/threads/SyncThread.h
        services/FolderService.h
        services/FolderService.cpp
        services/ImageService.cpp
        services/ImageService.h
        services/LibraryService.cpp
        services/LibraryService.h
        services/SqliteService.cpp
        services/SqliteService.h
        services/SyncService.cpp
        services/SyncService.h
        services/UserService.cpp
        services/UserService.h)

qt6_add_executable(${APP_NAME} MANUAL_FINALIZATION)
target_sources(${APP_NAME} PUBLIC ${APP_SOURCES})
target_sources(${APP_NAME} PUBLIC FILE_SET CXX_MODULES FILES foo.cxx)

add_dependencies(${APP_NAME} ${PROJECT_NAME})
target_link_libraries(${APP_NAME} PRIVATE ${PROJECT_NAME})

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
