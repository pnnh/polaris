#pragma once

#include "services/LibraryService.h"

#include <QtCore>
#include <QtQml/qqmlregistration.h>

typedef QVector<QString> LibraryData;

class LibraryViewModel : public QAbstractListModel
{
  Q_OBJECT
  QML_ELEMENT

public:
  explicit LibraryViewModel(QObject *parent = nullptr);
  ~LibraryViewModel() override;

  LibraryViewModel(const LibraryViewModel &) = delete;
  LibraryViewModel &operator=(const LibraryViewModel &) = delete;
  LibraryViewModel(LibraryViewModel &&) = delete;
  LibraryViewModel &operator=(LibraryViewModel &&) = delete;


  [[nodiscard]] int rowCount(const QModelIndex &parent) const override;
  [[nodiscard]] QHash<int, QByteArray> roleNames() const override;
  [[nodiscard]] QVariant data(const QModelIndex &index, int role) const override;

private:
  void loadData();
  QHash<int, QByteArray> dataNames;
  QVector<LibraryData *> dataList;
  LibraryService libraryService;
};
