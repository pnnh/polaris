#pragma once

#include <QString>

#include "native/models/pictures/Picture.h"

class ImageService
{
public:
  ImageService();

  std::optional<polaris::native::PSPictureModel> Find(const QString& uid) const;
  void InsertOrUpdate(const QVector<polaris::native::PSPictureModel>& libraryList);

private:
  QString dbPath;
};
