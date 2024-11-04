#include "LibraryService.h"

#include "SqliteService.h"
#include "UserService.h"
#include "utils/base32.h"

#include <QSqlQuery>
#include <QtWidgets/QApplication>
#include <qdir.h>
#include <qdiriterator.h>

LibraryService::LibraryService() {
  auto appDir = UserService::EnsureApplicationDirectory("/Polaris/Index");
  dbPath = appDir + "/Library.db";

  auto createSql = QString("create table if not exists libraries("
                           "uid varchar primary key not null,"
                           "name varchar(128) not null,"
                           "path varchar(512) not null)");
  if (!services::SqliteService::execute_query(dbPath, createSql)) {
    throw std::runtime_error("create table libraries error");
  }
  auto indexSql = QString(
      "create index if not exists index_libraries_path on libraries(path);");
  if (!services::SqliteService::execute_query(dbPath, indexSql)) {
    throw std::runtime_error("create index index_libraries_path error");
  }
}
std::optional<LibraryModel>
LibraryService::FindLibrary(const QString &uid) const {
  auto findSql = QString("select * from libraries where uid = :uid");

  QMap<QString, QVariant> parameters = {{
      ":uid",
      uid,
  }};
  auto sqlIterator =
      services::SqliteService::execute_query(dbPath, findSql, parameters);

  while (sqlIterator->next()) {
    auto model = LibraryModel{.uid = sqlIterator->value("uid").toString(),
                              .name = sqlIterator->value("name").toString(),
                              .path = sqlIterator->value("path").toString()};
    return model;
  }
  return std::nullopt;
}

QVector<LibraryModel> LibraryService::SelectLibraries() const {
  QVector<LibraryModel> libraryList;
  auto selectSql = QString("select * from libraries");

  auto sqlIterator = services::SqliteService::execute_query(dbPath, selectSql);

  while (sqlIterator->next()) {
    auto model = LibraryModel{.uid = sqlIterator->value("uid").toString(),
                              .name = sqlIterator->value("name").toString(),
                              .path = sqlIterator->value("path").toString()};
    libraryList.push_back(model);
  }
  return libraryList;
}

QVector<PartitionModel>
LibraryService::SelectPartitions(const LibraryModel &libraryModel) {

  QVector<PartitionModel> partitionList;
  QDir dir(libraryModel.path);
  if (!dir.exists()) {
    return partitionList;
  }
  // 设置过滤器
  dir.setFilter(QDir::Dirs | QDir::NoDotAndDotDot);
  dir.setSorting(QDir::Name | QDir::IgnoreCase); // 按照名称排序
  QDirIterator iterator(dir);
  while (iterator.hasNext()) {
    QFileInfo info(iterator.next());
    QString fileName = info.fileName(); // 获取文件名
    QString filePath = info.filePath(); // 文件目录+文件名

    if (!filePath.isEmpty()) {
      auto uid =
          Base32Encoder::Encode(filePath); // QUuid::createUuid().toString();
      auto model =
          PartitionModel{.uid = uid, .name = fileName, .path = filePath};
      partitionList.push_back(model);
    }
  }
  return partitionList;
}

void LibraryService::InsertOrUpdateLibrary(
    const QVector<LibraryModel> &libraryList) {
  // std::cout << "InsertOrUpdateLibrary: " << libraryList.size() << std::endl;

  const auto insertSql =
      QString("insert into libraries(uid, name, path)"
              " values(:uid, :name, :path)"
              " on conflict (uid) do update set name = :name;");
  for (const auto &library : libraryList) {
    QMap<QString, QVariant> parameters = {{
                                              ":uid",
                                              library.uid,
                                          },
                                          {":name", library.name},
                                          {":path", library.path}};
    if (!services::SqliteService::execute_query(dbPath, insertSql,
                                                parameters)) {
      throw std::runtime_error("create table libraries error");
    }
  }
}
