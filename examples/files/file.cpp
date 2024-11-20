
#include "file.h"
#include "native/business/filesystem/file.h"
#include "build.h"
#include "native/services/filesystem/filesystem.h"
#include "native/services/logger/logger.h"

namespace business = native::business;
namespace logger = native::services::logger;

int native::examples::TestSelectFiles()
{
    const std::string baseUrl = services::filesystem::JoinFilePath({PROJECT_SOURCE_DIR, "assets", "data"});
    auto fileServer = std::make_shared<business::FileServerBusiness>(baseUrl);
    auto filesPtr = fileServer->selectFiles();
    for (const auto &model : *filesPtr)
    {
        logger::Logger::LogInfo({model.URN, model.Title});
    }
    auto filesPtr2 = fileServer->selectFiles("CPlus.chan/assets");
    auto size = filesPtr2->size();
    for (const auto &model : *filesPtr2)
    {
        logger::Logger::LogInfo({model.URN, model.Title});
    }
    return 0;
}
