#pragma once

#include <QVector>

#include "quantum/models/articles/Library.h"
#include "quantum/models/articles/Notebook.h"

class LibraryService
{
public:
  LibraryService();


  std::optional<quantum::PSLibraryModel> FindLibrary(const QString& uid) const;
  QVector<quantum::PSLibraryModel> SelectLibraries() const;
  static QVector<quantum::PSNotebookModel> SelectPartitions(
    const quantum::PSLibraryModel& libraryModel);
  void InsertOrUpdateLibrary(const QVector<quantum::PSLibraryModel>& libraryList);

private:
  QString dbPath;
};
