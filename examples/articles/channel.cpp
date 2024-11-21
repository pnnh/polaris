
#include "channel.h"
#include "native/business/articles/channel.h"
#include "build.h"
#include "base/services/filesystem/filesystem.h"
#include "base/services/logger/logger.h"
#include "base/services/sqlite/SqliteService.h"

namespace business = native::business;
namespace logger = native::services::logger;

int native::examples::articles::TestArticleSelectChannels()
{
    const std::string baseUrl = services::filesystem::JoinFilePath({PROJECT_SOURCE_DIR, "assets", "data"});
    auto channelServer = std::make_shared<business::articles::ChannelServerBusiness>(baseUrl);
    auto channelsPtr = channelServer->selectChannels();
    for (const auto& model : *channelsPtr)
    {
        logger::Logger::LogInfo({model.URN, model.Name, model.Title});
    }
    return 0;
}
