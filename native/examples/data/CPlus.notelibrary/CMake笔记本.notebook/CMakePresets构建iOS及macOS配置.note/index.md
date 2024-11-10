
示例CMakeLists配置如下：

```
cmake_minimum_required(VERSION 3.10)

project(QuantumNative VERSION 0.0.1 LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 17)
set(CXX_STANDARD_REQUIRED)

add_library(QuantumNative SHARED
        quantum.cc
        quantum.h
        test.cc
        test.h)

if (APPLE)
    message("configure for Apple")
    set_target_properties(QuantumNative PROPERTIES
            FRAMEWORK TRUE
            FRAMEWORK_VERSION A
            MACOSX_FRAMEWORK_IDENTIFIER direct.multiverse.QuantumNative
            VERSION 0.0.1
            SOVERSION 0.0.1
            PUBLIC_HEADER "quantum.h"
            XCODE_ATTRIBUTE_CODE_SIGN_IDENTITY "iPhone Developer"
            MACOSX_BUNDLE TRUE)
endif()

set_target_properties(QuantumNative PROPERTIES
        PUBLIC_HEADER quantum.h
        OUTPUT_NAME "QuantumNative")

target_compile_definitions(QuantumNative PUBLIC DART_SHARED_LIB)

```

示例CMakePresets配置如下：

```
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
      },
      {
        "name": "macOS",
        "displayName": "macOS Config",
        "description": "macOS build using Xcode generator",
        "generator": "Xcode",
        "binaryDir": "${sourceDir}/output/macos",
        "cacheVariables": {
          "CMAKE_OSX_DEPLOYMENT_TARGET": {
            "type": "STRING",
            "value": "10.14"
          }
        },
        "environment": {}
      }
    ],
    "buildPresets": [
      {
        "name": "iOS",
        "configurePreset": "iOS"
      },
      {
        "name": "macOS",
        "configurePreset": "macOS"
      }
    ]
  }

```

## 构建iOS

```bash
# 配置cmake工程
cmake --preset Default
# 使用xcodebuild构建
xcodebuild -project target/QuantumIOS.xcodeproj -scheme QuantumNative -destination generic/platform=iOS -configuration Release build
# 真机构建构建
cmake --build --preset iOS --config Release
# iOS模拟器构建
cmake --build --preset iOS --config Release -- -sdk iphonesimulator
# cmake安装
cmake --install output/ios --config Release --prefix `pwd`/install
```
