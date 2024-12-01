
#include "file.h"
#include "calieo/telescope/business/filesystem/file.h"

#include <quantum/services/logger/logger.h>

#include "build.h"
#include "galaxy/quantum/services/filesystem/filesystem.h"

int calieo::telescope::examples::TestSelectFiles()
{
    const std::string baseUrl = quantum::JoinFilePath({PROJECT_SOURCE_DIR, "assets", "data"});
    auto fileServer = std::make_shared<calieo::telescope::FileServerBusiness>(baseUrl);
    auto filesPtr = fileServer->selectFiles();
    for (const auto& model : *filesPtr)
    {
        quantum::Logger::LogInfo({model.URN, model.Title});
    }
    auto filesPtr2 = fileServer->selectFiles("CPlus.chan/assets");
    auto size = filesPtr2->size();
    for (const auto& model : *filesPtr2)
    {
        quantum::Logger::LogInfo({model.URN, model.Title});
    }
    return 0;
}
