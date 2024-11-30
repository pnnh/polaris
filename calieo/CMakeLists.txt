set(CALIEO_NAME Calieo CACHE INTERNAL "CALIEO_NAME")

add_subdirectory(telescope)

if (CMAKE_BUILD_TYPE STREQUAL "Debug" AND (LINUX OR APPLE OR WIN32))
    add_subdirectory(examples)
endif ()

if (VCPKG_TARGET_TRIPLET STREQUAL "x64-windows")
    add_subdirectory(windows)
elseif (VCPKG_TARGET_TRIPLET STREQUAL "arm64-osx")
    add_subdirectory(macos)
elseif (EMSCRIPTEN)
    add_subdirectory(web)
elseif (LINUX)
    add_subdirectory(linux)
    add_subdirectory(server)
endif ()