
#include "channel.h"
#include "huable/starlight/business/articles/channel.h"
#include "build.h"
#include "quantum/services/filesystem/filesystem.h"
#include "quantum/services/logger/logger.h"
#include "quantum/services/database/SqliteService.h"


int huable::starlight::examples::articles::TestArticleSelectChannels()
{
    const std::string baseUrl = quantum::JoinFilePath({PROJECT_SOURCE_DIR, "assets", "data"});
    auto channelServer = std::make_shared<huable::starlight::ChannelServerBusiness>(baseUrl);
    auto channelsPtr = channelServer->selectChannels();
    for (const auto& model : *channelsPtr)
    {
        quantum::Logger::LogInfo({model.URN, model.Name, model.Title});
    }
    return 0;
}
