
#include "channel.h"
#include "native/business/articles/channel.h"

#include "native/services/filesystem/filesystem.h"
#include "native/services/logger/logger.h"
#include "native/services/sqlite/SqliteService.h"

namespace business = native::business;
namespace logger = native::services::logger;

int native::examples::articles::TestArticleSelectChannels()
{
    const std::string baseUrl = services::filesystem::JoinFilePath({"assets", "data"});
    auto channelServer = std::make_shared<business::articles::ChannelServerBusiness>(baseUrl);
    auto channelsPtr = channelServer->selectChannels();
    for (const auto& model : *channelsPtr)
    {
        logger::Logger::LogInfo({model.Name, model.Title});
    }
    return 0;
}
