#include "PictureLocationViewModel.h"

#include "services/UserService.h"

#include <QDebug>
#include <QDir>
#include <QStringView>
#include <QVector>

#include <services/FolderService.h>

PictureLocationViewModel::PictureLocationViewModel(QObject *parent)
    : QAbstractListModel(parent) {
  dataNames.insert(DataRole::Title, "title");
  dataNames.insert(DataRole::Path, "path");
  dataNames.insert(DataRole::Level, "level");
  dataNames.insert(DataRole::HasChildDirectory, "hasChildDirectory");
  load();
}

int PictureLocationViewModel::rowCount(const QModelIndex &parent) const {
  int size = static_cast<int>(dataList.size());
  return size;
}

QVariant PictureLocationViewModel::data(const QModelIndex &index,
                                        int role) const {
  const auto &dataRow = dataList[index.row()];
  const auto &value = dataRow[role];
  return value;
}

QHash<int, QByteArray> PictureLocationViewModel::roleNames() const {
  return dataNames;
}

void PictureLocationViewModel::load() {
  auto homeDirectory = UserService::HomeDirectory();
  auto model = std::make_unique<QMap<int, QVariant>>();
  model->insert(DataRole::Title, "Home");
  model->insert(DataRole::Path, homeDirectory);
  model->insert(DataRole::Level, 0);
  model->insert(DataRole::HasChildDirectory, true);

  dataList.append(*model);

  qInfo() << "files count = " << dataList.size();
}

void PictureLocationViewModel::open(const int index) {
  auto indexRow = index;
  auto path =
      dataList[indexRow][DataRole::Path].toString(); // 1对应path字段的编号
  auto level =
      dataList[indexRow][DataRole::Level].toInt(); // 2对应level字段的编号
  qInfo() << "open path = " << path;
  auto directries = FolderService::SelectDirectories(path);
  int count = static_cast<int>(directries.count());

  beginInsertRows(QModelIndex(), indexRow + 1, indexRow + count);
  std::unique_ptr<QMap<int, QVariant>> model;
  int rowOffset = indexRow + 1;
  for (const auto &dir : directries) {

    auto model = std::make_unique<QMap<int, QVariant>>();
    model->insert(DataRole::Title, dir);
    auto mPath = path + "/" + dir;
    model->insert(DataRole::Path, mPath);
    model->insert(DataRole::Level, QString::number(level + 1));
    auto hasChildDirectory = FolderService::HasChildDirectory(mPath);
    model->insert(DataRole::HasChildDirectory, hasChildDirectory);

    dataList.insert(rowOffset, *model);
    rowOffset++;
  }

  endInsertRows();
}

void PictureLocationViewModel::close(const int index) {
  auto indexRow = index;
  auto level =
      dataList[indexRow][DataRole::Level].toInt(); // 2对应level字段的编号
  qInfo() << "close path = " << index;

  for (int i = 0; i < dataList.size(); i++) {
    const auto &data = dataList[i];
    if (data[DataRole::Level].toInt() > level) {
      beginRemoveRows(QModelIndex(), i, i);
      dataList.removeAt(i);
      endRemoveRows();
      i--;
    }
  }
}

// void PictureLocationViewModel::add(QVariantMap value) {
//   auto index = value["index"].value<int>();
//   auto path = value["path"].value<QString>();
//   qDebug() << "insertRows2" << index << "name: " << path;

//   if (path.indexOf("file://") == 0) {
//     path = path.replace(0, 7, "");
//   }

//   beginInsertRows(QModelIndex(), index, index);

//   auto video2 = new QVector<QString>();
//   video2->append("qrc:/desktop/assets/images/icons/folder.svg");
//   video2->append(path);
//   video2->append("18222");
//   video2->append(path);
//   dataList.insert(index, video2);

//   endInsertRows();
// }
