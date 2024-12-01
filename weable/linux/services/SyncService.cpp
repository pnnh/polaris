#include "SyncService.h"

#include "UserService.h"
#include <iostream>
#include <qdir.h>
#include <qdiriterator.h>
#include <galaxy/quantum/services/filesystem/filesystem.h>

#include "weable/dawn/models/pictures/Picture.h"
#include "galaxy/quantum/utils/basex.h"
#include "galaxy/quantum/utils/mime.h"

int SyncService::SyncImages(const QString& path)
{
  QDir dir(path);
  if (!dir.exists())
  {
    return 0;
  }
  dir.setFilter(QDir::Dirs | QDir::Files);
  dir.setSorting(QDir::DirsFirst);
  QFileInfoList entryInfoList = dir.entryInfoList();

  QVector<weable::dawn::PSPictureModel> imageList;
  for (const auto& fileInfo : entryInfoList)
  {
    if (fileInfo.fileName() == "." || fileInfo.fileName() == "..")
    {
      continue;
    }
    const auto& filePath = fileInfo.filePath();
    const auto& fileName = fileInfo.fileName();
    if (fileInfo.isDir())
    {
      auto stdPathString = filePath.toStdString();
      if (quantum::isIgnore(stdPathString))
      {
        continue;
      }
      SyncImages(filePath);
    }
    else
    {
      auto stdFilePath = filePath.toStdString();
      if (quantum::MimeUtils::isImage(stdFilePath))
      {
        auto stdPathString = filePath.toStdString();
        auto uid = quantum::encode64(stdPathString);
        auto model = weable::dawn::PSPictureModel();
        model.URN = uid;
        model.Name = fileName.toStdString();
        model.Path = filePath.toStdString();

        imageList.push_back(model);
      }
    }
  }

  const int imageListSize = static_cast<int>(imageList.size());
  if (imageListSize > 0)
  {
    imageService.InsertOrUpdate(imageList);
  }
  return imageListSize;
}
