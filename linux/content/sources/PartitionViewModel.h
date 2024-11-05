#pragma once

#include "services/LibraryService.h"

#include <QtCore>
#include <QtQml/qqmlregistration.h>

typedef QVector<QString> PartitionData;

class PartitionViewModel : public QAbstractListModel
{
  Q_OBJECT
  QML_ELEMENT
  Q_PROPERTY(QString library READ library WRITE setLibrary)

public:
  explicit PartitionViewModel(QObject *parent = nullptr);
  ~PartitionViewModel() override;

  PartitionViewModel(const PartitionViewModel &) = delete;
  PartitionViewModel &operator=(const PartitionViewModel &) = delete;
  PartitionViewModel(PartitionViewModel &&) = delete;
  PartitionViewModel &operator=(PartitionViewModel &&) = delete;

  QString library() const;
  void setLibrary(const QString &library);

  [[nodiscard]] int rowCount(const QModelIndex &parent) const override;
  [[nodiscard]] QHash<int, QByteArray> roleNames() const override;
  [[nodiscard]] QVariant data(const QModelIndex &index, int role) const override;

private:
  void loadData();
  QString currentLibrary;
  QHash<int, QByteArray> dataNames;
  QVector<PartitionData *> dataList;
  LibraryService libraryService;
};
