#pragma once

#include "ImageService.h"

class SyncService {
public:
  void SyncLibraries();
  int SyncImages(const QString &path);

private:
  ImageService imageService;
};
