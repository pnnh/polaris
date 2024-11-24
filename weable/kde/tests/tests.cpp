#include "tests/tests.h"
#include "services/SqliteService.h"
#include <QGuiApplication>
#include <QLoggingCategory>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQmlDebuggingEnabler>
#include <QQuickWindow>
#include <iostream>
#include <spdlog/spdlog.h>

int TestSqliteVersion() {
  auto database_path = QGuiApplication::applicationDirPath() + "/venus.sqlite";
  auto version = services::SqliteService::sql_version(database_path);

  qDebug() << "sqlite3 version: " << version;
  int isOk = (int)version.indexOf("3.");
  return isOk;
}
