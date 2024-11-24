#pragma once

#include "ImageService.h"
#include "LibraryService.h"

class SyncService {
public:
  void SyncLibraries();
  int SyncImages(const QString &path);

private:
  LibraryService libraryService;
  ImageService imageService;
};
