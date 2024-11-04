//
// Created by linyangz on 2021/12/19.
//

#ifndef QT_EDITOR_SQLITE_H
#define QT_EDITOR_SQLITE_H

#include <QString>
#include <QDateTime>

typedef struct  //假定数据库存储内容
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

namespace sqlite {
TaskInfo getTask(QString pk);
void updateBody(QString pk, QString body);
}

#endif //QT_EDITOR_SQLITE_H
