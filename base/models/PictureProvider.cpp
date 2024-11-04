//
// Created by linyangz on 2023/2/11.
//

#include "PictureProvider.h"

#include <QDebug>
#include <QDir>
#include <QDirIterator>
#include <QStringView>
#include <QVector>

void load(const QString &path) {
  qInfo() << "Load====================================: " << path;
  // QString path = "/Users/linyangz/Projects/github/emotion-desktop/data";
  QDir dir(path);
  if (!dir.exists()) {
    qInfo() << "dir is null";
    return;
  }
  // 设置过滤器
  dir.setFilter(QDir::Files | QDir::NoDotAndDotDot);
  dir.setSorting(QDir::Name | QDir::IgnoreCase); // 按照名称排序
  QDirIterator iterator(dir);
  while (iterator.hasNext()) {
    // qInfo() << "iterator.fileName = " << iterator.fileName();
    QFileInfo info(iterator.next());
    QString name = info.fileName();     // 获取文件名
    QString fileName = info.filePath(); // 文件目录+文件名
    qInfo() << "fileName = " << fileName;
    // XXX

    if (!fileName.isEmpty() && !fileName.isNull()) {
      auto video = new QVector<QString>();
      video->append("file:" + fileName);
      // m_videos.append(video);
    }

    // iterator.next();
  }
}