
#include "channel.h"
#include <string>
#include <filesystem>
#include <quantum/utils/basex.h>

#include "quantum/types/Exception.h"
#include "quantum/services/filesystem/filesystem.h"
#include "quantum/services/yaml/yaml.h"
#include "quantum/utils/md5.h"
#include "quantum/types//String.h"

quantum::ChannelServerBusiness::ChannelServerBusiness(const std::string& baseUrl)
{
    this->baseUrl = baseUrl;
}

std::shared_ptr<std::vector<quantum::PSChannelModel>>
quantum::ChannelServerBusiness::selectChannels() const
{
    auto channels = std::make_shared<std::vector<PSChannelModel>>();

    for (const auto& entry : std::filesystem::directory_iterator(this->baseUrl))
    {
        auto dirName = entry.path().filename();
        if (entry.path() == "." || entry.path() == ".." || !entry.is_directory())
        {
            continue;
        }

        auto filePath = dirName.string();
        if (!isChannelDirectory(filePath))
        {
            continue;
        }
        auto channelModel = quantum::PSChannelModel(filePath);
        auto metadataFilePath = quantum::JoinFilePath({this->baseUrl, filePath, "metadata.yaml"});
        if (quantum::IsFileExist(metadataFilePath))
        {
            auto yamlHandler = quantum::YamlHandler(metadataFilePath);
            channelModel.URN = quantum::PSString::toLower(yamlHandler.getString("metadata.urn").value_or(""));
            channelModel.Title = yamlHandler.getString("metadata.title").value_or(filePath);
            channelModel.Description = yamlHandler.getString("metadata.description").value_or("");
            channelModel.Image = yamlHandler.getString("metadata.image").value_or("");
        }
        channelModel.Path = entry.path().string();
        if (channelModel.URN.empty())
        {
            channelModel.URN = quantum::PSString::toLower(quantum::calcMd5(entry.path().string()));
        }
        channels->emplace_back(channelModel);
    }

    return channels;
}

bool quantum::isChannelDirectory(const std::string& directoryName)
{
    return quantum::PSString::EndsWith(directoryName, ".chan") ||
        quantum::PSString::EndsWith(directoryName, ".channel") || quantum::PSString::EndsWith(
            directoryName, ".notechannel");
}
