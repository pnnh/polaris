
#include "library.h"
#include "huable/starlight/business/articles/library.h"

#include <build.h>
#include <quantum/services/logger/logger.h>

#include "quantum/services/filesystem/filesystem.h"

int huable::starlight::examples::articles::TestArticleSelectLibraries()
{
    const std::string baseUrl = quantum::JoinFilePath({PROJECT_SOURCE_DIR, "assets", "data"});
    auto libraryServer = std::make_shared<huable::starlight::LibraryServerBusiness>(baseUrl);
    auto libraryPtr = libraryServer->selectLibraries();
    for (const auto& model : *libraryPtr)
    {
        quantum::Logger::LogInfo({model.URN, model.Title, model.Title});
    }
    return 0;
}
