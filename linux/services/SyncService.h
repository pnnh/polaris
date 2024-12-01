#pragma once

#include "LibraryService.h"

class SyncService {
public:
  void SyncLibraries();
  int SyncImages(const QString &path);

private:
  LibraryService libraryService;
};
