---
image: cover.webp
---

演示通过cmake将Qt6项目编译为WebAssembly，并加载自定义中文字体

首先在官网注册并下载安装Qt。安装时需要勾选WebAssembly选项。截止目前本文所采用的Qt 6.2版本中，WebAssembly还是作为技术预览版出现，不太适合用于生产环境。

直接上代码

```cpp
// main.cpp

#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QFontDatabase>

int main(int argc, char *argv[]) {
  QGuiApplication app(argc, argv);

  // 设置全局字体，用于解决Qt for WebAssembly中文显示异常问题
  // fileName 参数不用带qrc前缀
  int fontId = QFontDatabase::addApplicationFont(":/qtwasm/qrc/ZhiMangXing-Regular.ttf");
  QStringList fontFamilies = QFontDatabase::applicationFontFamilies(fontId);
  qDebug()<<"fontfamilies:"<<fontFamilies;
  if (fontFamilies.size() > 0)
  {
    QFont font;
    auto fontFamilie = fontFamilies[0];
    font.setFamily(fontFamilie);//设置全局字体
    app.setFont(font);
  }

  QQmlApplicationEngine engine;
  const QUrl url(QStringLiteral("qrc:/qtwasm/qrc/Main.qml"));

  engine.load(url);

  if (engine.rootObjects().isEmpty())
    return -1;

  return app.exec();
}
```

通过QFontDatabase类加载自定义字体。其实fileName不需要加qrc前缀，不然加载不出来。

QML文件内容如下：

```qml
// Main.qml
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

Window {
    visible: true
    width: 800
    height: 600
    title: qsTr("Hello World")

    App{

    }
}

// App.qml
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ColumnLayout {
    Layout.fillHeight: true
    Layout.fillWidth: true

    RowLayout {
        height: 40
        Text {
            text: "Hello中文😯"
            font.pointSize: 20
        }
    }
    RowLayout {
        Layout.preferredHeight: 80
        TextEdit {
            text: "Please Input 请输入内容"
            selectByMouse: true
            font.pointSize: 20
        }
    }
}
```
qml内容比较简单，只是演示目的
CMakeLists.txt文件内容如下：

```cmake
cmake_minimum_required(VERSION 3.15)

project(qt-wasm VERSION 0.1 LANGUAGES CXX)

set(CMAKE_VERBOSE_MAKEFILE ON)
set(CMAKE_INCLUDE_CURRENT_DIR ON)

set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Qt6 COMPONENTS Core Gui Quick REQUIRED)

set(PROJECT_SOURCES
        main.cpp)

qt_add_executable(qt-wasm
        MANUAL_FINALIZATION
        ${PROJECT_SOURCES})

target_link_libraries(qt-wasm
        PRIVATE Qt6::Core Qt6::Gui Qt6::Quick)

# 当编译WebAssembly时修改链接参数，否则会报初始内存太小错误
if(EMSCRIPTEN)
    target_link_options(qt-wasm PRIVATE -s TOTAL_MEMORY=32MB)
endif()

qt_import_qml_plugins(qt-wasm)
qt_finalize_executable(qt-wasm)

qt_add_qml_module(qt-wasm
        URI qtwasm
        VERSION 1.0
        QML_FILES
        qrc/Main.qml qrc/App.qml
        RESOURCES
        qrc/ZhiMangXing-Regular.ttf)

```

其中qt_add_qml_module为qt 6.2新增的cmake api
在编译wasm时遇到了初始内存大小超出限制的错误，经过搜索需要加上TOTAL_MEMORY链接参数。在以上cmake文件内容中，通过判断是WebAssembly平台即加上该参数。
中文字体可以在网上下载或本机系统目录中拷贝。

在项目目录执行以下命令构建wasm文件：

```bash
mkdir build
cd build
cmake -DCMAKE_PREFIX_PATH=~/Qt/6.2.0/macos/lib/cmake -DCMAKE_TOOLCHAIN_FILE:PATH=~/Qt/6.2.0/wasm_32/lib/cmake/Qt6/qt.toolchain.cmake ..
make
```

需要把qt的文件目录，和wasm工具链的路径参数传递给cmake命令。
注意需要提前安装Emscripten编译环境，参考官方链接安装：Download and install — Emscripten 3.1.4-git (dev) documentation
执行make构建完成后，会在build目录生成以下文件：

```bash
qt-wasm.html
qt-wasm.js
qt-wasm.wasm
qtloader.js
```

其中qt-wasm是我们在CMakeLists.txt文件中设置的可执行文件名称
如果想看构建完wasm文件之后的运行效果，可以在build目录启动一个简单的http服务器，在浏览器访问相应端口即可。
这里采用node的http-server来运行：

npm i -g http-server  # 安装工具，需要node环境
http-sever		# 下build目录执行该命令

执行完http-server命令后，即可在浏览器中访问127.0.0.1:8080来查看编译后的效果。
qt通过网页中的canvas来绘制qml文件中描述的内容。

目前可以显示中文了，但是对中文输入法的支持很不好，无法正常输入。同时生成的wasm文件大约有20M，即使gzip压缩后也有7M左右，是不太适合直接应用到网站项目中的。希望后续会有所改善。
