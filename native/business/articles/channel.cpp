
#include "channel.h"
#include <string>
#include <dirent.h>
#include <stdio.h>
#include <stdlib.h>
#include <string>
#include <iostream>
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
    DIR* pDir;
    dirent* ptr;
    if (!((pDir = opendir(this->baseUrl.c_str()))))
    {
        logger::Logger::LogInfo("Folder doesn't Exist!");
        return channels;
    }
    while ((ptr = readdir(pDir)) != nullptr)
    {
        if (strcmp(ptr->d_name, ".") == 0 || strcmp(ptr->d_name, "..") == 0 || ptr->d_type != DT_DIR)
        {
            continue;
        }
        auto dirName = std::string(ptr->d_name);

        if (!isChannelDirectory(dirName))
        {
            continue;
        }
        auto channelModel = models::articles::PSChannelModel(ptr->d_name);
        auto metadataFilePath = services::filesystem::JoinFilePath({this->baseUrl, dirName, "metadata.yaml"});
        if (services::filesystem::IsFileExist(metadataFilePath))
        {
            auto yamlHandler = services::yaml::YamlHandler(metadataFilePath);
            channelModel.Title = yamlHandler.getString("metadata.title").value_or(ptr->d_name);
        }
        channels->emplace_back(channelModel);
    }
    closedir(pDir);

    return channels;
}

bool business::articles::isChannelDirectory(const std::string& directoryName)
{
    return utils::StringUtils::EndsWith(directoryName, ".chan") || utils::StringUtils::EndsWith(
        directoryName, ".channel") || utils::StringUtils::EndsWith(directoryName, ".notechannel");
}