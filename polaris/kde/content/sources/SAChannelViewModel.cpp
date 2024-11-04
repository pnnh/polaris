#include "SAChannelViewModel.h"

#include "services/UserService.h"

#include <QDebug>
#include <QDir>
#include <QStringView>

SAChannelViewModel::SAChannelViewModel(QObject *parent)
    : QAbstractListModel(parent) {
  int role = Qt::UserRole;
  dataNames.insert(role++, "title");
  dataNames.insert(role++, "path");
  load();
}

SAChannelViewModel::~SAChannelViewModel() {}

int SAChannelViewModel::rowCount(const QModelIndex &parent) const {
  int size = static_cast<int>(dataList.size());
  return size;
}

QVariant SAChannelViewModel::data(const QModelIndex &index, int role) const {
  const QVector<QString> &data = dataList[index.row()];
  return data.at(role - Qt::UserRole);
}

QHash<int, QByteArray> SAChannelViewModel::roleNames() const {
  return dataNames;
}

void SAChannelViewModel::load() {
  auto homeDirectory = UserService::HomeDirectory();
  auto model = QVector<QString>();
  model.append("第一频道");
  model.append(homeDirectory);
  dataList.append(model);

  qInfo() << "files count = " << dataList.size();
}
