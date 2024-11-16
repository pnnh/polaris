#pragma once

#include <QString>

#include "native/models/pictures/Picture.h"

class ImageService
{
public:
  ImageService();

  std::optional<native::models::pictures::PSPictureModel> Find(const QString& uid) const;
  void InsertOrUpdate(const QVector<native::models::pictures::PSPictureModel>& libraryList);

private:
  QString dbPath;
};
