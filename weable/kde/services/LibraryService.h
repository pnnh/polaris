#pragma once

#include "models/LibraryModel.h"

class LibraryService {
public:
  LibraryService();


  std::optional<LibraryModel> FindLibrary(const QString &uid) const;
  QVector<LibraryModel> SelectLibraries() const;
  static QVector<PartitionModel> SelectPartitions(const LibraryModel &libraryModel) ;
  void InsertOrUpdateLibrary(const QVector<LibraryModel>& libraryList);

private:
  QString dbPath;
};