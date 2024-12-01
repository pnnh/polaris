#pragma once

#include <QVector>

#include "huable/starlight/models/articles/Library.h"
#include "huable/starlight/models/articles/Notebook.h"

class LibraryService
{
public:
  LibraryService();


  std::optional<huable::starlight::PSLibraryModel> FindLibrary(const QString& uid) const;
  QVector<huable::starlight::PSLibraryModel> SelectLibraries() const;
  static QVector<huable::starlight::PSNotebookModel> SelectPartitions(
    const huable::starlight::PSLibraryModel& libraryModel);
  void InsertOrUpdateLibrary(const QVector<huable::starlight::PSLibraryModel>& libraryList);

private:
  QString dbPath;
};
