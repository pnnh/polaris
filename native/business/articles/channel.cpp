
#include "channel.h"
#include <string>
#include <filesystem>
#include "native/models/protocol/Exception.h"
#include "native/services/filesystem/filesystem.h"
#include "native/services/sqlite/SqliteService.h"
#include "native/services/logger/logger.h"
#include "native/services/yaml/yaml.h"
#include "native/utils/StringUtils.h"

namespace models = native::models;
namespace business = native::business;
namespace services = native::services;
namespace logger = native::services::logger;

business::articles::ChannelServerBusiness::ChannelServerBusiness(const std::string& baseUrl)
{
    this->baseUrl = baseUrl;
}

std::shared_ptr<std::vector<models::articles::PSChannelModel>>
business::articles::ChannelServerBusiness::selectChannels() const
{
    auto channels = std::make_shared<std::vector<models::articles::PSChannelModel>>();

    for (const auto& entry : std::filesystem::directory_iterator(this->baseUrl))
    {
        auto dirName = entry.path().filename();
        if (entry.path() == "." || entry.path() == ".." || !entry.is_directory())
        {
            continue;
        }

        if (!isChannelDirectory(dirName))
        {
            continue;
        }
        auto channelModel = models::articles::PSChannelModel(dirName);
        auto metadataFilePath = services::filesystem::JoinFilePath({this->baseUrl, dirName, "metadata.yaml"});
        if (services::filesystem::IsFileExist(metadataFilePath))
        {
            auto yamlHandler = services::yaml::YamlHandler(metadataFilePath);
            channelModel.Title = yamlHandler.getString("metadata.title").value_or(dirName);
        }
        channels->emplace_back(channelModel);
    }

    return channels;
}

bool business::articles::isChannelDirectory(const std::string& directoryName)
{
    return utils::StringUtils::EndsWith(directoryName, ".chan") || utils::StringUtils::EndsWith(
        directoryName, ".channel") || utils::StringUtils::EndsWith(directoryName, ".notechannel");
}
