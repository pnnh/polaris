#pragma once

#include "models/ImageModel.h"

#include <QString>

class ImageService {
public:
  ImageService();

  std::optional<ImageModel> Find(const QString &uid) const;
  void InsertOrUpdate(const QVector<ImageModel>& libraryList);

private:
  QString dbPath;
};