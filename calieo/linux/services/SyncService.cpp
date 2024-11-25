#include "SyncService.h"

#include "UserService.h"
#include <iostream>
#include <qdir.h>
#include <qdiriterator.h>
#include <quantum/services/filesystem/filesystem.h>

#include "calieo/telescope/models/pictures/Picture.h"
#include "galaxy/quantum/utils/basex.h"
#include "galaxy/quantum/utils/mime.h"

void SyncService::SyncLibraries()
{
  auto appDir = UserService::EnsureApplicationDirectory("/Polaris/Data");
  QDir dir(appDir);
  if (!dir.exists())
  {
    std::cerr << "应用主目录不存在无法同步" << std::endl;
    return;
  }
  // 设置过滤器
  dir.setFilter(QDir::Dirs | QDir::NoDotAndDotDot);
  dir.setSorting(QDir::Name | QDir::IgnoreCase); // 按照名称排序
  QDirIterator iterator(dir);
  QVector<calieo::telescope::PSLibraryModel> libraryList;
  while (iterator.hasNext())
  {
    QFileInfo info(iterator.next());
    QString fileName = info.fileName(); // 获取文件名
    QString filePath = info.filePath(); // 文件目录+文件名

    if (!filePath.isEmpty() && !filePath.isNull())
    {
      if (fileName == "Index.db" || !fileName.endsWith(".vslibrary"))
      {
        continue;
      }
      auto stdPathString = filePath.toStdString();
      auto uid = quantum::encode64(stdPathString);
      auto model = calieo::telescope::PSLibraryModel();
      model.URN = uid;
      model.Name = fileName.toStdString();
      model.Path = filePath.toStdString();
      libraryList.push_back(model);
    }
  }
  // std::cout << "SyncLibraries: " << libraryList.size() << std::endl;
  libraryService.InsertOrUpdateLibrary(libraryList);
}

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

  QVector<calieo::telescope::PSPictureModel> imageList;
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
        auto model = calieo::telescope::PSPictureModel();
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
