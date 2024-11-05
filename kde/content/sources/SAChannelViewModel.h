#pragma once

#include <QAbstractListModel>
#include <QtQml/qqmlregistration.h>

class SAChannelViewModel : public QAbstractListModel {
  Q_OBJECT
  QML_ELEMENT

public:
  explicit SAChannelViewModel(QObject *parent = nullptr);
  ~SAChannelViewModel() override;

  SAChannelViewModel(const SAChannelViewModel &) = delete;
  SAChannelViewModel &operator=(const SAChannelViewModel &) = delete;
  SAChannelViewModel(SAChannelViewModel &&) = delete;
  SAChannelViewModel &operator=(SAChannelViewModel &&) = delete;

  int rowCount(const QModelIndex &parent) const override;
  QVariant data(const QModelIndex &index, int role) const override;
  QHash<int, QByteArray> roleNames() const override;

private:
  void load();

  QHash<int, QByteArray> dataNames;
  QVector<QVector<QString>> dataList;
};
