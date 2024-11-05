#include "SASessionListViewModel.h"

#include "services/UserService.h"
#include <QDebug>
#include <QDir>
#include <QStringView>

SASessionListViewModel::SASessionListViewModel(QObject *parent)
    : QAbstractListModel(parent) {
  int role = Qt::UserRole;
  dataNames.insert(role++, "title");
  dataNames.insert(role++, "path");
  load();
}

SASessionListViewModel::~SASessionListViewModel() {}

int SASessionListViewModel::rowCount(const QModelIndex &parent) const {
  int size = static_cast<int>(dataList.size());
  return size;
}

QVariant SASessionListViewModel::data(const QModelIndex &index,
                                      int role) const {
  const QVector<QString> *dataRow = dataList[index.row()];
  return dataRow->at(role - Qt::UserRole);
}

QHash<int, QByteArray> SASessionListViewModel::roleNames() const {
  return dataNames;
}

void SASessionListViewModel::load() {
  auto homeDirectory = UserService::HomeDirectory();
  std::unique_ptr<QVector<QString>> model =
      std::make_unique<QVector<QString>>();
  model->append("一个聊天用户");
  model->append(homeDirectory);
  dataList.append(model.get());

  qInfo() << "files count = " << dataList.size();
}
