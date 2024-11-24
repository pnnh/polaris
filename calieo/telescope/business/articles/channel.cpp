
#include "channel.h"
#include <string>
#include <filesystem>
#include "quantum/types/Exception.h"
#include "quantum/services/filesystem/filesystem.h"
#include "calieo/telescope/services/yaml/yaml.h"
#include "quantum/utils/md5.h"
#include "quantum/types//String.h"

polaris::native::ChannelServerBusiness::ChannelServerBusiness(const std::string& baseUrl)
{
    this->baseUrl = baseUrl;
}

std::shared_ptr<std::vector<polaris::native::PSChannelModel>>
polaris::native::ChannelServerBusiness::selectChannels() const
{
    auto channels = std::make_shared<std::vector<polaris::native::PSChannelModel>>();

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
        auto channelModel = polaris::native::PSChannelModel(dirName);
        auto metadataFilePath = polaris::base::JoinFilePath({this->baseUrl, dirName, "metadata.yaml"});
        if (polaris::base::IsFileExist(metadataFilePath))
        {
            auto yamlHandler = polaris::base::YamlHandler(metadataFilePath);
            channelModel.URN = yamlHandler.getString("metadata.urn").value_or("");
            channelModel.Title = yamlHandler.getString("metadata.title").value_or(dirName);
            channelModel.Description = yamlHandler.getString("metadata.description").value_or("");
            channelModel.Image = yamlHandler.getString("metadata.image").value_or("");
        }
        if (channelModel.URN.empty())
        {
            channelModel.URN = polaris::base::calcMd5(entry.path().string());
        }
        channels->emplace_back(channelModel);
    }

    return channels;
}

bool polaris::native::isChannelDirectory(const std::string& directoryName)
{
    return polaris::base::PSString::EndsWith(directoryName, ".chan") ||
        polaris::base::PSString::EndsWith(directoryName, ".channel") || polaris::base::PSString::EndsWith(
            directoryName, ".notechannel");
}
