
#include "channel.h"
#include <string>
#include <filesystem>
#include "galaxy/quantum/types/Exception.h"
#include "galaxy/quantum/services/filesystem/filesystem.h"
#include "calieo/telescope/services/yaml/yaml.h"
#include "galaxy/quantum/utils/md5.h"
#include "galaxy/quantum/types//String.h"

calieo::telescope::ChannelServerBusiness::ChannelServerBusiness(const std::string& baseUrl)
{
    this->baseUrl = baseUrl;
}

std::shared_ptr<std::vector<calieo::telescope::PSChannelModel>>
calieo::telescope::ChannelServerBusiness::selectChannels() const
{
    auto channels = std::make_shared<std::vector<calieo::telescope::PSChannelModel>>();

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
        auto channelModel = calieo::telescope::PSChannelModel(dirName);
        auto metadataFilePath = quantum::JoinFilePath({this->baseUrl, dirName, "metadata.yaml"});
        if (quantum::IsFileExist(metadataFilePath))
        {
            auto yamlHandler = quantum::YamlHandler(metadataFilePath);
            channelModel.URN = yamlHandler.getString("metadata.urn").value_or("");
            channelModel.Title = yamlHandler.getString("metadata.title").value_or(dirName);
            channelModel.Description = yamlHandler.getString("metadata.description").value_or("");
            channelModel.Image = yamlHandler.getString("metadata.image").value_or("");
        }
        if (channelModel.URN.empty())
        {
            channelModel.URN = quantum::calcMd5(entry.path().string());
        }
        channels->emplace_back(channelModel);
    }

    return channels;
}

bool calieo::telescope::isChannelDirectory(const std::string& directoryName)
{
    return quantum::PSString::EndsWith(directoryName, ".chan") ||
        quantum::PSString::EndsWith(directoryName, ".channel") || quantum::PSString::EndsWith(
            directoryName, ".notechannel");
}
