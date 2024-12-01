
#include <spdlog/spdlog.h>
#include "huable/linux/services/threads/SyncThread.h"
#include <QtQuick>
#include <iostream>

int main(int argc, char* argv[])
{
#ifndef NDEBUG
    spdlog::set_level(spdlog::level::info);
#endif
    spdlog::info("Server {}", "Started");
    QQmlDebuggingEnabler::enableDebugging(true);
    QLoggingCategory::defaultCategory()->setEnabled(QtDebugMsg, true);

    spdlog::debug("i love c++1");
    spdlog::info("i love c++2");
    spdlog::error("i love c++3");
    qInfo() << "test info";
    qWarning() << "test warning";
    std::cerr << "Hello, World333333!" << std::endl;
    qDebug() << "Hello, World444444!";

    QGuiApplication app(argc, argv);
    QGuiApplication::setApplicationDisplayName(
        QStringLiteral("This example is powered by qmltc!"));

    QQmlApplicationEngine engine;
    const QUrl url(QStringLiteral(u"qrc:/qt/qml/quick/content/Main.qml"));

    QObject::connect(
        &engine, &QQmlApplicationEngine::objectCreationFailed, &app,
        []() { QCoreApplication::exit(-1); }, Qt::QueuedConnection);

    engine.load(url);

    const auto& rootObjects = engine.rootObjects();
    if (rootObjects.isEmpty())
    {
        return -1;
    }
    const auto& rootObject = rootObjects.first();
    // if (rootObject != nullptr) {
    QMetaObject::invokeMethod(rootObject, "sayHello");
    //}

    //    QQuickWindow *mainWindow = qobject_cast<QQuickWindow *>(rootObject);

    //    QQuickItem *rect = mainWindow->findChild<QQuickItem *>("myItem");
    //    qDebug() << "rect: " << rect;

    //    if (mainWindow != nullptr) {
    //        QMetaObject::invokeMethod(mainWindow, "sayHello");
    //    }

    // 启动同步服务
    SyncThread syncThread;
    syncThread.start();

    QObject::connect(&syncThread, &SyncThread::resultReady,
                     [&engine, &rootObject](const QString& result)
                     {
                         // qDebug() << "同步结果:" << result;
                         QMetaObject::invokeMethod(rootObject, "sayHello");
                     });

    return QGuiApplication::exec();
}





