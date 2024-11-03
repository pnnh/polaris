#include "PictureGridModel.h"

#include <QDebug>
#include <QDir>
#include <QDirIterator>
#include <QStringView>
#include <QVector>

PictureGridModel::PictureGridModel(QObject *parent)
    : QAbstractListModel(parent) {
  int role = Qt::UserRole;
  dataNames.insert(role++, "picSrc");
}

int PictureGridModel::rowCount(const QModelIndex &parent) const {
  return static_cast<int>(dataList.size());
}

QVariant PictureGridModel::data(const QModelIndex &index, int role) const {
  QVector<QString> *d = dataList[index.row()];
  return d->at(role - Qt::UserRole);
}

QHash<int, QByteArray> PictureGridModel::roleNames() const { return dataNames; }

QString PictureGridModel::getFolder() const {
  return currentFolder;
}
void PictureGridModel::setFolder(const QString &folder) {
  currentFolder = folder;
  reset();
}

void PictureGridModel::remove(int index) {
  beginRemoveRows(QModelIndex(), index, index);
  delete dataList.takeAt(index);
  endRemoveRows();
}

void PictureGridModel::load(const QString &path) {
  qInfo() << "Load====================================load: " << path;
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
    // qInfo() << "fileName = " << fileName;
    //  XXX

    if (!fileName.isEmpty() && !fileName.isNull()) {
      auto video = new QVector<QString>();
      video->append("file:" + fileName);
      dataList.append(video);
    }

    // iterator.next();
  }
  qInfo() << "files count = " << dataList.size();
}

void PictureGridModel::reset() {
  beginResetModel();
  load(currentFolder);
  endResetModel();
}

