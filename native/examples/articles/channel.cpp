
#include "channel.h"
#include "native/business/articles/channel.h"
#include "native/services/logger/logger.h"
#include "native/services/sqlite/SqliteService.h"

namespace business = native::business;
namespace logger = native::services::logger;

int native::examples::articles::TestArticleSelectChannels()
{
    const std::string baseUrl = "data";
    auto channelServer = std::make_shared<business::articles::ChannelServerBusiness>(baseUrl);
    auto channelsPtr = channelServer->selectChannels();
    for (const auto& model : *channelsPtr)
    {
        logger::Logger::LogInfo(model.Name);
    }
    return 0;
}
