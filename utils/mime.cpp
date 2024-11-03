#include "mime.h"

#include <QImageReader>

bool MimeUtils::isImage(const QString &path) {
  QImageReader reader(path);
  return reader.canRead();
}

bool MimeUtils::isHidden(const QString &path) { return path.startsWith("."); }

// 一般不处理这些特殊的路径下面的文件
bool MimeUtils::isIgnore(const QString &path) {
  return path.startsWith(".") || path.endsWith("node_modules") || path.endsWith("build");
}
