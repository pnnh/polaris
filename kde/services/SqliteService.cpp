#include "SqliteService.h"

#include "threads/SyncThread.h"

#include <QDateTime>
#include <QSqlError>
#include <QTextStream>
#include <QUuid>
#include <QtSql/QSqlDatabase>
#include <QtSql/QSqlQuery>
#include <QtSql/QSqlRecord>
#include <QtWidgets/QApplication>
#include <iostream>

services::SqlIterator::SqlIterator(std::unique_ptr<QSqlQuery> query)
    : sqlQueryPtr(std::move(query)) {}

bool services::SqlIterator::next() const { return sqlQueryPtr->next(); }

QVariant services::SqlIterator::value(const int index) const {
  return sqlQueryPtr->value(index).toString();
}

QVariant services::SqlIterator::value(const QString &name) const {
  return sqlQueryPtr->value(name).toString();
}

int services::SqlIterator::column_count() const {
  return sqlQueryPtr->record().count();
}

QString services::SqlIterator::column_name(const int index) const {
  return sqlQueryPtr->record().fieldName(index);
}

QSqlDatabase getDatabase(const QString &dbPath) {
  QSqlDatabase database;
  auto connectionName = QString("[%1]%2").arg(
      QString::number(quint64(QThread::currentThread()), sizeof(quint64)),
      dbPath);
  if (QSqlDatabase::contains(connectionName)) {
    database = QSqlDatabase::database(connectionName);
  } else {
    database = QSqlDatabase::addDatabase("QSQLITE", connectionName);
    database.setDatabaseName(dbPath);
  }
  if (!database.open()) {
    throw std::runtime_error("Error: Failed to connect database." +
                             database.lastError().databaseText().toStdString());
  }
  return database;
}

QString services::SqliteService::sql_version(const QString &dbPath) {
  auto database = getDatabase(dbPath);
  QSqlQuery versionQuery{database};
  versionQuery.exec("select sqlite_version();");
  versionQuery.next();
  QString sqliteVersion = versionQuery.value("sqlite_version()").toString();
  versionQuery.finish();
  QString outVersion;
  QTextStream out(&outVersion);
  out << sqliteVersion;
  return outVersion;
}

std::shared_ptr<services::SqlIterator> services::SqliteService::execute_query(
    const QString &dbPath, const QString &sql_text,
    const QMap<QString, QVariant> &parameters) {
  QSqlDatabase database = getDatabase(dbPath);

  auto query = new QSqlQuery(database);

  if (!query->prepare(sql_text)) {
    throw std::runtime_error("Sqlite3Service::query出错: " +
                             query->lastError().text().toStdString());
  }

  for (const auto &each : parameters.toStdMap()) {
    query->bindValue(each.first, each.second);
  }

  if (!query->exec()) {
    throw std::runtime_error("Sqlite3Service::query出错2: " +
                             query->lastError().text().toStdString());
  }
  auto sqlIterator =
      std::make_shared<SqlIterator>(std::unique_ptr<QSqlQuery>(query));
  return sqlIterator;
}

// std::shared_ptr<services::Sqlite3Service> services::getSqlite3Service(QString
// dbPath) {
//   auto dbFullPath = dbPath;
//   if (dbPath == "") {
//     dbFullPath = QApplication::applicationDirPath() + "/venus.sqlite";
//   } else if (!dbPath.startsWith("/")) {
//     dbFullPath = QApplication::applicationDirPath() + "/" + dbPath;
//   }
//   qDebug() << "数据库目录：" << dbFullPath << Qt::endl;
//
//   return std::make_shared<Sqlite3Service>(dbFullPath);
// }
