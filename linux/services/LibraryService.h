#pragma once

#include <QVector>

#include "native/models/articles/Library.h"
#include "native/models/articles/Notebook.h"

class LibraryService
{
public:
  LibraryService();


  std::optional<native::models::articles::PSLibraryModel> FindLibrary(const QString& uid) const;
  QVector<native::models::articles::PSLibraryModel> SelectLibraries() const;
  static QVector<native::models::articles::PSNotebookModel> SelectPartitions(
    const native::models::articles::PSLibraryModel& libraryModel);
  void InsertOrUpdateLibrary(const QVector<native::models::articles::PSLibraryModel>& libraryList);

private:
  QString dbPath;
};
