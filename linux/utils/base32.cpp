//
// Created by Larry on 2024/5/8.
//

#include "base32.h"

#include <qbitarray.h>
#include <qcryptographichash.h>

QString Base32Encoder::Encode(const QString &data) {
  auto byteData = data.toUtf8();
  return QString("%1").arg(QString(
      QCryptographicHash::hash(byteData, QCryptographicHash::Sha1).toHex()));
}