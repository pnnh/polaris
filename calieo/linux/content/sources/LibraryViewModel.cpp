#include "content/sources/LibraryViewModel.h"

LibraryViewModel::LibraryViewModel(QObject* parent)
  : QAbstractListModel(parent)
{
  int role = Qt::UserRole;
  dataNames.insert(role++, "uid");
  dataNames.insert(role++, "name");

  loadData();
}

LibraryViewModel::~LibraryViewModel()
{
}

void LibraryViewModel::loadData()
{
  auto libraryList = libraryService.SelectLibraries();

  QVector<calieo::telescope::PSLibraryModel>::iterator iter;
  for (iter = libraryList.begin(); iter != libraryList.end(); iter++)
  {
    auto* dataPtr = new LibraryData();

    QString uid = QString::fromStdString((*iter).URN);
    QString name = QString::fromStdString((*iter).Name);

    dataPtr->append(uid);
    dataPtr->append(name);
    dataList.append(dataPtr);
  }
}

int LibraryViewModel::rowCount(
  const QModelIndex& parent = QModelIndex()) const
{
  auto size = dataList.size();
  return size;
}

QVariant LibraryViewModel::data(const QModelIndex& index, int role) const
{
  LibraryData* dataPtr = dataList[index.row()];
  auto value = dataPtr->at(role - Qt::UserRole);
  return value;
}

QHash<int, QByteArray> LibraryViewModel::roleNames() const { return dataNames; }