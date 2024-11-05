#pragma once

#include <QString>

class MimeUtils {
public:
  static bool isImage(const QString &path);
  static bool isHidden(const QString &path);
  static bool isIgnore(const QString &path);
};
