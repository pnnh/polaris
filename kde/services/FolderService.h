#pragma once

#include <QList>
#include <QString>

class FolderService {
public:
  FolderService();
  static QList<QString> SelectDirectories(const QString &prefixPath);
  static bool HasChildDirectory(const QString &prefixPath);
};
