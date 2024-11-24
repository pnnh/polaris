#pragma once

#include <QVector>

#include "calieo/telescope/models/articles/Library.h"
#include "calieo/telescope/models/articles/Notebook.h"

class LibraryService
{
public:
  LibraryService();


  std::optional<calieo::telescope::PSLibraryModel> FindLibrary(const QString& uid) const;
  QVector<calieo::telescope::PSLibraryModel> SelectLibraries() const;
  static QVector<calieo::telescope::PSNotebookModel> SelectPartitions(
    const calieo::telescope::PSLibraryModel& libraryModel);
  void InsertOrUpdateLibrary(const QVector<calieo::telescope::PSLibraryModel>& libraryList);

private:
  QString dbPath;
};
