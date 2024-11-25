
#include "channel.h"
#include <string>
#include <filesystem>
#include "quantum/types/Exception.h"
#include "quantum/services/filesystem/filesystem.h"
#include "huable/starlight/services/yaml/yaml.h"
#include "quantum/utils/md5.h"
#include "quantum/types//String.h"

huable::starlight::ChannelServerBusiness::ChannelServerBusiness(const std::string& baseUrl)
{
    this->baseUrl = baseUrl;
}

std::shared_ptr<std::vector<huable::starlight::PSChannelModel>>
huable::starlight::ChannelServerBusiness::selectChannels() const
{
    auto channels = std::make_shared<std::vector<huable::starlight::PSChannelModel>>();

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
        auto channelModel = huable::starlight::PSChannelModel(dirName);
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

bool huable::starlight::isChannelDirectory(const std::string& directoryName)
{
    return quantum::PSString::EndsWith(directoryName, ".chan") ||
        quantum::PSString::EndsWith(directoryName, ".channel") || quantum::PSString::EndsWith(
            directoryName, ".notechannel");
}
