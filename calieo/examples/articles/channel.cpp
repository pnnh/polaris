
#include "channel.h"
#include "calieo/telescope/business/articles/channel.h"
#include "build.h"
#include "quantum/services/filesystem/filesystem.h"
#include "quantum/services/logger/logger.h"
#include "quantum/services/database/SqliteService.h"


int native::examples::articles::TestArticleSelectChannels()
{
    const std::string baseUrl = polaris::base::JoinFilePath({PROJECT_SOURCE_DIR, "assets", "data"});
    auto channelServer = std::make_shared<polaris::native::ChannelServerBusiness>(baseUrl);
    auto channelsPtr = channelServer->selectChannels();
    for (const auto& model : *channelsPtr)
    {
        polaris::base::Logger::LogInfo({model.URN, model.Name, model.Title});
    }
    return 0;
}
