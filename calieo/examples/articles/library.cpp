
#include "library.h"
#include "native/business/articles/library.h"

#include <build.h>

#include "base/services/filesystem/filesystem.h"
#include "base/services/logger/logger.h"

namespace business = native::business;
namespace logger = native::services::logger;

int native::examples::articles::TestArticleSelectLibraries()
{
    const std::string baseUrl = services::filesystem::JoinFilePath({PROJECT_SOURCE_DIR, "assets", "data"});
    auto libraryServer = std::make_shared<business::articles::LibraryServerBusiness>(baseUrl);
    auto libraryPtr = libraryServer->selectLibraries();
    for (const auto& model : *libraryPtr)
    {
        logger::Logger::LogInfo({model.URN, model.Title, model.Title});
    }
    return 0;
}
