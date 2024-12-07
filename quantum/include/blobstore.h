#pragma once
#include <memory>
#include <string>
#include "rust/cxx.h"

class BlobstoreClient {
public:
  BlobstoreClient();

};

std::unique_ptr<BlobstoreClient> new_blobstore_client();