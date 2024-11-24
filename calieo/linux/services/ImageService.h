#pragma once

#include <QString>

#include "calieo/telescope/models/pictures/Picture.h"

class ImageService
{
public:
  ImageService();

  std::optional<calieo::telescope::PSPictureModel> Find(const QString& uid) const;
  void InsertOrUpdate(const QVector<calieo::telescope::PSPictureModel>& libraryList);

private:
  QString dbPath;
};
