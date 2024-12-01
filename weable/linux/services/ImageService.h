#pragma once

#include <QString>

#include "weable/dawn/models/pictures/Picture.h"

class ImageService
{
public:
  ImageService();

  std::optional<weable::dawn::PSPictureModel> Find(const QString& uid) const;
  void InsertOrUpdate(const QVector<weable::dawn::PSPictureModel>& libraryList);

private:
  QString dbPath;
};
