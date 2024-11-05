#include "content/sources/PartitionViewModel.h"

#include "services/LibraryService.h"

PartitionViewModel::PartitionViewModel(QObject *parent)
    : QAbstractListModel(parent) {
  int role = Qt::UserRole;
  dataNames.insert(role++, "uid");
  dataNames.insert(role++, "name");

  loadData();
}

PartitionViewModel::~PartitionViewModel() {}
QString PartitionViewModel::library() const { return currentLibrary; }
void PartitionViewModel::setLibrary(const QString &library) {
  currentLibrary = library;
  loadData();
}

void PartitionViewModel::loadData() {
  if (currentLibrary.isEmpty()) {
    return;
  }
  const auto libraryModel = libraryService.FindLibrary(currentLibrary);
  if (!libraryModel.has_value()) {
    return;
  }
  auto partitionList = LibraryService::SelectPartitions(libraryModel.value());

  beginResetModel();
  dataList.clear();

  QVector<PartitionModel>::iterator iter;
  for (iter = partitionList.begin(); iter != partitionList.end(); iter++) {
    auto *dataPtr = new PartitionData();

    QString uid = (*iter).uid;
    QString name = (*iter).name;

    dataPtr->append(uid);
    dataPtr->append(name);
    dataList.append(dataPtr);
  }
  endResetModel();
}

int PartitionViewModel::rowCount(
    const QModelIndex &parent = QModelIndex()) const {
  auto size = dataList.size();
  return size;
}

QVariant PartitionViewModel::data(const QModelIndex &index, int role) const {
  PartitionData *dataPtr = dataList[index.row()];
  auto value = dataPtr->at(role - Qt::UserRole);
  return value;
}

QHash<int, QByteArray> PartitionViewModel::roleNames() const {
  return dataNames;
}
