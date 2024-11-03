#pragma once

#include <QString>

class Base32Encoder {
public:
  static QString Encode(const QString &data);
};
