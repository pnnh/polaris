---
image: cover.webp
---

出于兴趣学习QT开发框架。刚接触不久，直接学习的QML开发，对QWidgets不了解。

一般通过CMake构建QT项目，CMakeLists文件会这么写：
cmake_minimum_required(VERSION 3.15)

project(qtempty VERSION 0.1 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Qt6 COMPONENTS Core Quick REQUIRED)

set(PROJECT_SOURCES main.cpp qml.qrc)

qt_add_executable(PickThumb
        MANUAL_FINALIZATION
        ${PROJECT_SOURCES})

target_link_libraries(PickThumb
        PRIVATE Qt${QT_VERSION_MAJOR}::Core Qt${QT_VERSION_MAJOR}::Quick)

qt_import_qml_plugins(PickThumb)
qt_finalize_executable(PickThumb)
其中在qt_add_executable调用中需要指定qml.qrc文件，这个是QT资源文件声明
qml.qrc文件内容大致如下：
<RCC>
    <qresource prefix="/">
        <file>main.qml</file>
    </qresource>
</RCC>

在qt 6.2时包含了一个qml module功能，可以在CMakeLists.txt文件中通过qt6_add_qml_module调用来指定资源文件，并生成qml module。这样可以省去qml.qrc文件。
这时CMakeLists.txt文件可以写成下面这样：
cmake_minimum_required(VERSION 3.18)

project(hello VERSION 1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Qt6 6.2 COMPONENTS Quick Gui REQUIRED)

qt_add_executable(myapp main.cpp)

target_link_libraries(myapp PRIVATE Qt6::Gui Qt6::Quick)

qt6_add_qml_module(myapp
        URI hello
        VERSION 1.0
        QML_FILES main.qml Foo.qml)
在qt_add_executable调用中可以不需要再指定qml.qrc文件，同时这个文件可以删掉不再使用了。
在main.cc文件中加载qml文件时，需要指定module：
#include <QGuiApplication>
#include <QQmlApplicationEngine>

int main(int argc, char *argv[])
{
  QGuiApplication app(argc, argv);

  QQmlApplicationEngine engine;
  const QUrl url(u"qrc:/hello/main.qml"_qs);
  engine.load(url);

  return app.exec();
}
其中 const QUrl url(u"qrc:/hello/main.qml"_qs);里面的hello，即是CMakeLists.txt文件中指定的模块名称（通过URI声明）
在qml文件中，需要这样指定qml module依赖：
import QtQuick
import hello

Window {
    id: root
    visible: true
    Text {
        text: "Hello, world!"
        anchors.centerIn: parent
        color: "#000"
    }
    Foo {
    }
}
通过import hello引入qml module模块，就可以在下面声明Foo组件了。