#pragma once

#include <QAbstractListModel>
#include <QtQml/qqmlregistration.h>

class PictureLocationViewModel : public QAbstractListModel {
  Q_OBJECT
  QML_ELEMENT

  enum DataRole { Title = Qt::UserRole, Path, Level, HasChildDirectory };

public:
  explicit PictureLocationViewModel(QObject *parent = nullptr);

  int rowCount(const QModelIndex &parent) const override;
  QVariant data(const QModelIndex &index, int role) const override;
  QHash<int, QByteArray> roleNames() const override;

  Q_INVOKABLE void open(const int index);
  Q_INVOKABLE void close(const int index);

private:
  void load();

  QHash<int, QByteArray> dataNames;
  QVector<QMap<int, QVariant>> dataList;
};
