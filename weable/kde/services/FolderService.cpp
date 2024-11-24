#include "FolderService.h"

#include <QDir>

FolderService::FolderService() {}

QList<QString> FolderService::SelectDirectories(const QString &prefixPath) {
  QList<QString> directories;
  QDir dir(prefixPath);
  if (!dir.exists()) {
    return directories;
  }

  auto list = dir.entryList(QDir::Dirs | QDir::NoDotAndDotDot);
  for (const auto &subDir : list) {
    directories.append(subDir);
  }
  return directories;
}

bool FolderService::HasChildDirectory(const QString &prefixPath) {
  QDir dir(prefixPath);
  if (!dir.exists()) {
    return false;
  }

  auto list = dir.entryList(QDir::Dirs | QDir::NoDotAndDotDot);
  return !list.empty();
}
