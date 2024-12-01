#include "LibraryModel.h"

// #include "../services/UserService.h"

// #include <QSqlQuery>
// #include <QtWidgets/QApplication>
// #include <qdir.h>
// #include <qdiriterator.h>

//
// TaskInfo sqlite::getTask(QString pk) {
//  QSqlQuery query;
//  auto insertSql = QString("select * from %1 where pk=:pk").arg(TableUsers);
//  query.prepare(insertSql);
//  query.bindValue(":pk", pk);
//
//  auto insertResult = query.exec();
//
//  qDebug() << "updateInfoTitle: " << query.lastError().text();
//
//  TaskInfo tmp;
//  while (query.next()) {
//    tmp.pk = query.value("pk").toString();
//    tmp.title = query.value("title").toString();
//    tmp.body = query.value("body").toString();
//    tmp.creator = query.value("creator").toString();
//    tmp.create_time = query.value("create_time").toDateTime();
//    tmp.update_time = query.value("update_time").toDateTime();
//  }
//  return tmp;
//}
//
// void sqlite::updateBody(QString pk, QString body) {
//  QSqlQuery query;
//  auto insertSql =
//      QString("update %1 set body = :body, update_time=:update_time "
//              "where pk = :pk")
//          .arg(TableUsers);
//  query.prepare(insertSql);
//  query.bindValue(":pk", pk);
//  query.bindValue(":body", body);
//  QDateTime timestamp = QDateTime::currentDateTime();
//  query.bindValue(":update_time", timestamp);
//
//  auto insertResult = query.exec();
//
//  qDebug() << "updateBody: " << query.lastError().text();
//}
//
// void addInfo(TaskInfo info) {
//  QSqlQuery query;
//  auto insertSql =
//      QString(
//          "INSERT INTO %1 (pk, title, body, creator, create_time,
//          update_time)" "VALUES (:pk, :title, :body, :creator, :create_time,
//          :update_time)") .arg(TableUsers);
//  query.prepare(insertSql);
//  QUuid id = QUuid::createUuid();
//  QString strId = id.toString();
//  strId.remove("{").remove("}").remove("-"); // 一般习惯去掉左右花括号和连字符
//  qDebug() << strId;
//  query.bindValue(":pk", strId);
//  query.bindValue(":title", info.title); // 给每个插入值标识符设定具体值
//  query.bindValue(":body", info.body);
//  query.bindValue(":creator", "1");
//  QDateTime timestamp = QDateTime::currentDateTime();
//  query.bindValue(":create_time", timestamp);
//  query.bindValue(":update_time", timestamp);
//
//  auto insertResult = query.exec();
//
//  qDebug() << "insertResult: " << query.lastError().text();
//}
//
// void updateInfoTitle(QString pk, QString title) {
//  QSqlQuery query;
//  auto insertSql =
//      QString("update %1 set title = :title, update_time=:update_time "
//              "where pk = :pk")
//          .arg(TableUsers);
//  query.prepare(insertSql);
//  query.bindValue(":pk", pk);
//  query.bindValue(":title", title);
//  QDateTime timestamp = QDateTime::currentDateTime();
//  query.bindValue(":update_time", timestamp);
//
//  auto insertResult = query.exec();
//
//  qDebug() << "updateInfoTitle: " << query.lastError().text();
//}
