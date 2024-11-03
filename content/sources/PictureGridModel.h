#pragma once

#include <QAbstractListModel>
#include <QtQml/qqmlregistration.h>

class PictureGridModel : public QAbstractListModel {
  Q_OBJECT
  QML_ELEMENT

  Q_PROPERTY(QString folder READ getFolder WRITE setFolder)
public:
  explicit PictureGridModel(QObject *parent = nullptr);

  int rowCount(const QModelIndex &parent) const override;

  QVariant data(const QModelIndex &index, int role) const override;

  QHash<int, QByteArray> roleNames() const override;

  QString getFolder() const;
  void setFolder(const QString &folder);

  Q_INVOKABLE void remove(int index);

private:
  void load(const QString &path);
  void reset();

  QString currentFolder;
  QHash<int, QByteArray> dataNames;
  QVector<QVector<QString> *> dataList;
};
