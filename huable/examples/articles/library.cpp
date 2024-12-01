
#include "library.h"
#include "calieo/telescope/business/articles/library.h"

#include <build.h>
#include <quantum/services/logger/logger.h>

#include "galaxy/quantum/services/filesystem/filesystem.h"

int calieo::telescope::examples::articles::TestArticleSelectLibraries()
{
    const std::string baseUrl = quantum::JoinFilePath({PROJECT_SOURCE_DIR, "assets", "data"});
    auto libraryServer = std::make_shared<calieo::telescope::LibraryServerBusiness>(baseUrl);
    auto libraryPtr = libraryServer->selectLibraries();
    for (const auto& model : *libraryPtr)
    {
        quantum::Logger::LogInfo({model.URN, model.Title, model.Title});
    }
    return 0;
}
