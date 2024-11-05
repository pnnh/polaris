#include "UserService.h"

#include <qdir.h>
#include <qstandardpaths.h>

QString UserService::EnsureApplicationDirectory(const QString &dataDir) {
  auto documentsLocation =
      QStandardPaths::standardLocations(QStandardPaths::DocumentsLocation);
  if (documentsLocation.count() < 1)
    throw std::runtime_error("无法读写文档目录");

  auto dirList = dataDir.split("/");

  QString fullDirPath = documentsLocation[0];
  for (const auto &dir : dirList) {
    if (dir.isEmpty() || dir.isNull()) {
      continue;
    }
    // 确认目录是否存在，不存在时创建
    fullDirPath = fullDirPath + "/" + dir;
    QDir currentDir(fullDirPath);
    if (!currentDir.exists()) {
      if (auto isOk = currentDir.mkpath(fullDirPath); !isOk) {
        throw std::runtime_error("创建目录失败");
      }
    }
  }
  return documentsLocation[0] + dataDir;
}

QString UserService::HomeDirectory() {

  auto homeLocations =
      QStandardPaths::standardLocations(QStandardPaths::HomeLocation);
  if (homeLocations.count() < 1)
    throw std::runtime_error("无法读写文档目录");
  return homeLocations[0];
}