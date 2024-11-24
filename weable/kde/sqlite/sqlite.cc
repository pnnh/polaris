//
// Created by linyangz on 2021/12/19.
//

#include "sqlite.h"
#include <QApplication>
#include <QSqlDatabase>
#include <QSqlQuery>
#include <QSqlRecord>
#include <QSqlError>
#include <QUuid>
#include <QDateTime>

const QString TableUsers = "users";

QVector<TaskInfo> runSqlite() {
    QVector<TaskInfo> infoVect; //testInfo向量，用于存储数据库查询到的数据

    QSqlDatabase db = QSqlDatabase::addDatabase("QSQLITE");

    auto dbName = QApplication::applicationDirPath() + "/data.sqlite";
    db.setDatabaseName(dbName);
    if (!db.open()) {
        qDebug() << "打开数据库文件出错: " << db.lastError().text();
        return infoVect;
    }

/**************************使用QSqlQuery操作数据库**************************/
    QSqlQuery query;    //执行操作类对象

    //判断表是否已经存在
    QString sql = QString("select * from sqlite_master where name='%1'").arg(TableUsers);
    if (!query.exec(sql)) {
        qDebug() << "检查表是否存在出错: " << query.lastError().text();
        return infoVect;
    }
    QString columnName;
    if (query.next()) {
        columnName = query.value("name").toString();
    }
    if (columnName != TableUsers) {
        auto createSql = QString("CREATE TABLE %1("
                                 "pk VARCHAR PRIMARY KEY NOT NULL,"
                                 "title VARCHAR NOT NULL,"
                                 "body VARCHAR NOT NULL,"
                                 "creator VARCHAR NOT NULL,"
                                 "create_time TIMESTAMP NOT NULL,"
                                 "update_time TIMESTAMP NOT NULL)"
        ).arg(TableUsers);
        if (!query.exec(createSql)) {
            qDebug() << "创建表出错: " << query.lastError().text();
            //qDebug() << "Database Error: " << query.lastError().text();
            return infoVect;
        }
    }

    //查询数据
    auto querySql = QString("SELECT * FROM %1 order by create_time desc").arg(TableUsers);
    query.prepare(querySql);
    query.exec();    //执行

    QSqlRecord recode = query.record();        //recode保存查询到一些内容信息，如表头、列数等等
    int column = recode.count();            //获取读取结果的列数
    QString s1 = recode.fieldName(0);        //获取第0列的列名

    while (query.next()) {
        TaskInfo tmp;
        tmp.pk = query.value("pk").toString();
        tmp.title = query.value("title").toString();
        tmp.creator = query.value("creator").toString();
        tmp.create_time = query.value("create_time").toDateTime();
        tmp.update_time = query.value("update_time").toDateTime();

        infoVect.push_back(tmp);   //将查询到的内容存到testInfo向量中
    }

//  for (int i = 0; i < infoVect.size(); i++)    //打印输出
//  {
//    qDebug() << infoVect[i].UserName << ":"    \
// << infoVect[i].IP << ":"        \
// << infoVect[i].Port << ":"        \
// << infoVect[i].PassWord << ":" \
// << infoVect[i].Type;
//  }

    //插入数据


    //更改表中 UserName=user4 的Type属性为admin
//  query.prepare("UPDATE posts SET title='admin' WHERE pk='user4'");
//  query.exec();

    //删除表中 UserName=user4的用户信息
    //auto deleteSql = QString("DELETE FROM %1 WHERE UserName='user4'").arg(TableUsers);
//  query.prepare(deleteSql);
//  query.exec();

    return infoVect;
}

TaskInfo sqlite::getTask(QString pk) {
    QSqlQuery query;
    auto insertSql = QString("select * from %1 where pk=:pk").arg(TableUsers);
    query.prepare(insertSql);
    query.bindValue(":pk", pk);

    auto insertResult = query.exec();

    qDebug() << "updateInfoTitle: " << query.lastError().text();

    TaskInfo tmp;
    while (query.next()) {
        tmp.pk = query.value("pk").toString();
        tmp.title = query.value("title").toString();
        tmp.body = query.value("body").toString();
        tmp.creator = query.value("creator").toString();
        tmp.create_time = query.value("create_time").toDateTime();
        tmp.update_time = query.value("update_time").toDateTime();
    }
    return tmp;
}

void sqlite::updateBody(QString pk, QString body) {
    QSqlQuery query;
    auto insertSql = QString("update %1 set body = :body, update_time=:update_time "
                             "where pk = :pk").arg(TableUsers);
    query.prepare(insertSql);
    query.bindValue(":pk", pk);
    query.bindValue(":body", body);
    QDateTime timestamp = QDateTime::currentDateTime();
    query.bindValue(":update_time", timestamp);

    auto insertResult = query.exec();

    qDebug() << "updateBody: " << query.lastError().text();
}

void addInfo(TaskInfo info) {
    QSqlQuery query;
    auto insertSql = QString("INSERT INTO %1 (pk, title, body, creator, create_time, update_time)"
                             "VALUES (:pk, :title, :body, :creator, :create_time, :update_time)").arg(TableUsers);
    query.prepare(insertSql);
    QUuid id = QUuid::createUuid();
    QString strId = id.toString();
    strId.remove("{").remove("}").remove("-"); // 一般习惯去掉左右花括号和连字符
    qDebug() << strId;
    query.bindValue(":pk", strId);
    query.bindValue(":title", info.title);    //给每个插入值标识符设定具体值
    query.bindValue(":body", info.body);
    query.bindValue(":creator", "1");
    QDateTime timestamp = QDateTime::currentDateTime();
    query.bindValue(":create_time", timestamp);
    query.bindValue(":update_time", timestamp);

    auto insertResult = query.exec();

    qDebug() << "insertResult: " << query.lastError().text();
}

void updateInfoTitle(QString pk, QString title) {
    QSqlQuery query;
    auto insertSql = QString("update %1 set title = :title, update_time=:update_time "
                             "where pk = :pk").arg(TableUsers);
    query.prepare(insertSql);
    query.bindValue(":pk", pk);
    query.bindValue(":title", title);
    QDateTime timestamp = QDateTime::currentDateTime();
    query.bindValue(":update_time", timestamp);

    auto insertResult = query.exec();

    qDebug() << "updateInfoTitle: " << query.lastError().text();
}
