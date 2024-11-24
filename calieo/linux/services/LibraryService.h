#pragma once

#include <QVector>

#include "calieo/telescope/models/articles/Library.h"
#include "calieo/telescope/models/articles/Notebook.h"

class LibraryService
{
public:
  LibraryService();


  std::optional<polaris::native::PSLibraryModel> FindLibrary(const QString& uid) const;
  QVector<polaris::native::PSLibraryModel> SelectLibraries() const;
  static QVector<polaris::native::PSNotebookModel> SelectPartitions(
    const polaris::native::PSLibraryModel& libraryModel);
  void InsertOrUpdateLibrary(const QVector<polaris::native::PSLibraryModel>& libraryList);

private:
  QString dbPath;
};
