#include "ImageService.h"

#include "SqliteService.h"
#include "UserService.h"
#include <QtWidgets/QApplication>
#include <qdir.h>

#include "weable/dawn/models/pictures/Picture.h"

ImageService::ImageService()
{
  auto appDir = UserService::EnsureApplicationDirectory("/Polaris/Index");
  dbPath = appDir + "/Image.db";

  auto createSql = QString("create table if not exists images("
    "uid varchar primary key not null,"
    "name varchar(128) not null,"
    "path varchar(512) not null)");
  if (!services::SqliteService::execute_query(dbPath, createSql))
  {
    throw std::runtime_error("create table images error");
  }
  auto indexSql = QString(
    "create index if not exists index_images_path on images(path);");
  if (!services::SqliteService::execute_query(dbPath, indexSql))
  {
    throw std::runtime_error("create index index_images_path error");
  }
}

std::optional<weable::dawn::PSPictureModel>
ImageService::Find(const QString& uid) const
{
  auto findSql = QString("select * from images where uid = :uid");

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
    auto model = std::make_optional<weable::dawn::PSPictureModel>();
    model->URN = sqlIterator->value("uid").toString().toStdString();
    model->Name = sqlIterator->value("name").toString().toStdString();
    model->Path = sqlIterator->value("path").toString().toStdString();

    return model;
  }
  return std::nullopt;
}

void ImageService::InsertOrUpdate(
  const QVector<weable::dawn::PSPictureModel>& imageList)
{
  const auto insertSql =
    QString("insert into images(uid, name, path)"
      " values(:uid, :name, :path)"
      " on conflict (uid) do update set name = :name;");
  for (const auto& image : imageList)
  {
    QMap<QString, QVariant> parameters = {
      {
        ":uid",
        QString::fromStdString(image.URN),
      },
      {":name", QString::fromStdString(image.Name)},
      {":path", QString::fromStdString(image.Path)}
    };
    if (!services::SqliteService::execute_query(dbPath, insertSql,
                                                parameters))
    {
      throw std::runtime_error("create table images error");
    }
  }
}
