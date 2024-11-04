#pragma once

#include <QAbstractListModel>
#include <QtQml/qqmlregistration.h>

class SASessionListViewModel : public QAbstractListModel {
  Q_OBJECT
  QML_ELEMENT

public:
  explicit SASessionListViewModel(QObject *parent = 0);
  ~SASessionListViewModel() override;

  SASessionListViewModel(const SASessionListViewModel &) = delete;
  SASessionListViewModel &operator=(const SASessionListViewModel &) = delete;
  SASessionListViewModel(SASessionListViewModel &&) = delete;
  SASessionListViewModel &operator=(SASessionListViewModel &&) = delete;

  int rowCount(const QModelIndex &parent) const override;
  QVariant data(const QModelIndex &index, int role) const override;
  QHash<int, QByteArray> roleNames() const override;

private:
  void load();

  QHash<int, QByteArray> dataNames;
  QVector<QVector<QString> *> dataList;
};
