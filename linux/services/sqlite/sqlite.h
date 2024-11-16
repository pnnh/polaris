#pragma once

#include <QString>
#include <QDateTime>

typedef struct //假定数据库存储内容
{
  QString pk;
  QString title;
  QString body;
  QString creator;
  QDateTime create_time;
  QDateTime update_time;
} TaskInfo;

QVector<TaskInfo> runSqlite();
void addInfo(TaskInfo info);
void updateInfoTitle(QString pk, QString title);

namespace sqlite
{
  TaskInfo getTask(QString pk);
  void updateBody(QString pk, QString body);
}

