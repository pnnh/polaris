#include "LibraryService.h"

#include "SqliteService.h"
#include "UserService.h"

#include <qdir.h>
#include <qdiriterator.h>

#include "quantum/models/articles/Library.h"
#include "quantum/models/articles/Notebook.h"
#include "quantum/utils/basex.h"

LibraryService::LibraryService()
{
  auto appDir = UserService::EnsureApplicationDirectory("/Polaris/Index");
  dbPath = appDir + "/Library.db";

  auto createSql = QString("create table if not exists libraries("
    "uid varchar primary key not null,"
    "name varchar(128) not null,"
    "path varchar(512) not null)");
  if (!services::SqliteService::execute_query(dbPath, createSql))
  {
    throw std::runtime_error("create table libraries error");
  }
  auto indexSql = QString(
    "create index if not exists index_libraries_path on libraries(path);");
  if (!services::SqliteService::execute_query(dbPath, indexSql))
  {
    throw std::runtime_error("create index index_libraries_path error");
  }
}

std::optional<quantum::PSLibraryModel>
LibraryService::FindLibrary(const QString& uid) const
{
  auto findSql = QString("select * from libraries where uid = :uid");

  QMap<QString, QVariant> parameters = {
    {
      ":uid",
      uid,
    }
  };
  auto sqlIterator =
    services::SqliteService::execute_query(dbPath, findSql, parameters);

  while (sqlIterator->next())
  {
    auto model = std::make_optional<quantum::PSLibraryModel>();
    model->URN = sqlIterator->value("uid").toString().toStdString();
    model->Name = sqlIterator->value("name").toString().toStdString();
    model->Path = sqlIterator->value("path").toString().toStdString();
    return model;
  }
  return std::nullopt;
}

QVector<quantum::PSLibraryModel> LibraryService::SelectLibraries() const
{
  QVector<quantum::PSLibraryModel> libraryList;
  auto selectSql = QString("select * from libraries");

  auto sqlIterator = services::SqliteService::execute_query(dbPath, selectSql);

  while (sqlIterator->next())
  {
    auto model = quantum::PSLibraryModel();
    model.URN = sqlIterator->value("uid").toString().toStdString();
    model.Name = sqlIterator->value("name").toString().toStdString();
    model.Path = sqlIterator->value("path").toString().toStdString();

    libraryList.push_back(model);
  }

  return libraryList;
}

QVector<quantum::PSNotebookModel>
LibraryService::SelectPartitions(const quantum::PSLibraryModel& libraryModel)
{
  QVector<quantum::PSNotebookModel> partitionList;
  QDir dir(QString::fromStdString(libraryModel.Path));
  if (!dir.exists())
  {
    return partitionList;
  }
  // 设置过滤器
  dir.setFilter(QDir::Dirs | QDir::NoDotAndDotDot);
  dir.setSorting(QDir::Name | QDir::IgnoreCase); // 按照名称排序
  QDirIterator iterator(dir);
  while (iterator.hasNext())
  {
    QFileInfo info(iterator.next());
    QString fileName = info.fileName(); // 获取文件名
    QString filePath = info.filePath(); // 文件目录+文件名

    if (!filePath.isEmpty())
    {
      auto stdPathString = filePath.toStdString();
      auto uid = quantum::encode64(stdPathString);

      auto model =
        quantum::PSNotebookModel();
      model.URN = uid;
      model.Name = fileName.toStdString();
      model.Path = filePath.toStdString();
      partitionList.push_back(model);
    }
  }
  return partitionList;
}

void LibraryService::InsertOrUpdateLibrary(
  const QVector<quantum::PSLibraryModel>& libraryList)
{
  // std::cout << "InsertOrUpdateLibrary: " << libraryList.size() << std::endl;

  const auto insertSql =
    QString("insert into libraries(uid, name, path)"
      " values(:uid, :name, :path)"
      " on conflict (uid) do update set name = :name;");
  for (const auto& library : libraryList)
  {
    QMap<QString, QVariant> parameters = {
      {
        ":uid",
        QString::fromStdString(library.URN),
      },
      {":name", QString::fromStdString(library.Name)},
      {":path", QString::fromStdString(library.Path)}
    };
    if (!services::SqliteService::execute_query(dbPath, insertSql,
                                                parameters))
    {
      throw std::runtime_error("create table libraries error");
    }
  }
}
