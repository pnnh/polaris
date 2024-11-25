
#include "channel.h"
#include "calieo/telescope/business/articles/channel.h"
#include "build.h"
#include "galaxy/quantum/services/filesystem/filesystem.h"
#include "galaxy/quantum/services/logger/logger.h"
#include "galaxy/quantum/services/database/SqliteService.h"


int calieo::telescope::examples::articles::TestArticleSelectChannels()
{
    const std::string baseUrl = quantum::JoinFilePath({PROJECT_SOURCE_DIR, "assets", "data"});
    auto channelServer = std::make_shared<calieo::telescope::ChannelServerBusiness>(baseUrl);
    auto channelsPtr = channelServer->selectChannels();
    for (const auto& model : *channelsPtr)
    {
        quantum::Logger::LogInfo({model.URN, model.Name, model.Title});
    }
    return 0;
}
