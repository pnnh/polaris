#pragma once

#include <QString>

class UserService {
public:
  static QString EnsureApplicationDirectory(const QString& dataDir);
  static QString HomeDirectory();
};

