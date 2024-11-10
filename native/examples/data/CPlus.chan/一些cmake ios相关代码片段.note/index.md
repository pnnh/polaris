---
image: cover.png
---

## 编译ios下的framework
```cmake
cmake_minimum_required(VERSION 3.10)

project(QuantumNative VERSION 0.0.1 LANGUAGES C CXX)


set(CMAKE_CXX_STANDARD 17)
set(CXX_STANDARD_REQUIRED)


include(FetchContent)

FetchContent_Declare(simple
        GIT_REPOSITORY https://github.com/wangfenjin/simple.git
        GIT_TAG v0.2.2)
FetchContent_MakeAvailable(simple)

#FetchContent_GetProperties(simple)
#if(NOT simple_POPULATED)
#    # Fetch the content using previously declared details
#    FetchContent_Populate(simple)
#    add_subdirectory(${simple_SOURCE_DIR} ${simple_BINARY_DIR})
#endif()
message("simple2 ${simple_SOURCE_DIR} ${simple_BINARY_DIR}")

add_library(QuantumNative SHARED
        quantum.cc
        quantum.h
        #  database/database.cpp
        test.cc
        test.h
        )

target_link_libraries(QuantumNative PRIVATE simple)
target_link_libraries(QuantumNative PRIVATE SQLite3)

if (APPLE)
    message("configure for Apple")
#    set(MACOSX_FRAMEWORK_IDENTIFIER "direct.multiverse.QuantumNative")
#    set(MACOSX_FRAMEWORK_NAME "QuantumNative")
#    set(MACOSX_FRAMEWORK_BUNDLE_VERSION "1.0.0")
#    set(MACOSX_FRAMEWORK_SHORT_VERSION_STRING "1.0.0")

    # set(RESOURCE_FILES
    #         ${CMAKE_BINARY_DIR}/cppjieba/src/cppjieba/dict/jieba.dict.utf8)

    message("cppjiebadict ${RESOURCE_FILES}")
    set_target_properties(QuantumNative PROPERTIES
            FRAMEWORK TRUE
            FRAMEWORK_VERSION A
            MACOSX_FRAMEWORK_IDENTIFIER direct.multiverse.QuantumNative
            VERSION 0.0.1
            SOVERSION 0.0.1
            PUBLIC_HEADER "quantum.h"
            XCODE_ATTRIBUTE_CODE_SIGN_IDENTITY "iPhone Developer"
            MACOSX_BUNDLE TRUE
            # RESOURCE "${RESOURCE_FILES}"
            )
endif()

set_target_properties(QuantumNative PROPERTIES
        PUBLIC_HEADER quantum.h
        OUTPUT_NAME "QuantumNative"
        )

target_compile_definitions(QuantumNative PUBLIC DART_SHARED_LIB)


```

## iOS cmake-presets配置

```json

{
    "version": 3,
    "cmakeMinimumRequired": {
      "major": 3,
      "minor": 22,
      "patch": 0
    },
    "configurePresets": [
      {
        "name": "iOS",
        "displayName": "iOS Config",
        "description": "iOS build using Xcode generator",
        "generator": "Xcode", 
        "binaryDir": "${sourceDir}/output/ios",
        "cacheVariables": {
            "CMAKE_SYSTEM_NAME": {
                "type": "STRING",
                "value": "iOS"
            },
            "CMAKE_IOS_INSTALL_COMBINED": {
                "type": "BOOL",
                "value": "YES"
            },
         
            "CMAKE_OSX_ARCHITECTURES": {
                "type": "STRING",
                "value": "arm64;arm64;arm64;arm64;x86_64"
            },
            "CMAKE_OSX_DEPLOYMENT_TARGET": {
                "type": "STRING",
                "value": "14.0"
            },
            "CMAKE_XCODE_ATTRIBUTE_ONLY_ACTIVE_ARCH": "NO",
            "CMAKE_XCODE_ATTRIBUTE_CODE_SIGNING_REQUIRED": "NO",
            "CMAKE_XCODE_ATTRIBUTE_CODE_SIGNING_ALLOWED": "NO"
        },
        "environment": {}
      }
    ],
    "buildPresets": [
      {
        "name": "iOS",
        "configurePreset": "iOS"
      }
    ]
  }

```

## 执行构建

```bash

## 构建iOS

```bash
# 配置cmake工程
cmake --preset Default
# 使用xcodebuild构建
xcodebuild -project target/QuantumIOS.xcodeproj -scheme QuantumNative -destination generic/platform=iOS -configuration Release build
# 真机构建构建
cmake --build --preset iOS --config Release
# iOS模拟器构建
cmake --build --preset iOS -sdk iphonesimulator
# cmake安装
cmake --install output/ios --config Release --prefix install
```
