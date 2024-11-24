
#include "library.h"
#include <string>
#include <filesystem>
#include <base/types/String.h>

#include "base/types/Exception.h"
#include "base/services/filesystem/filesystem.h"
#include "base/services/logger/logger.h"
#include "base/services/yaml/yaml.h"
#include "base/utils/md5.h"

polaris::native::LibraryServerBusiness::LibraryServerBusiness(const std::string& baseUrl)
{
    this->baseUrl = baseUrl;
}

std::shared_ptr<std::vector<polaris::native::PSLibraryModel>>
polaris::native::LibraryServerBusiness::selectLibraries() const
{
    auto libraries = std::make_shared<std::vector<polaris::native::PSLibraryModel>>();

    for (const auto& entry : std::filesystem::directory_iterator(this->baseUrl))
    {
        auto dirName = entry.path().filename();
        if (entry.path() == "." || entry.path() == ".." || !entry.is_directory())
        {
            continue;
        }

        if (!isLibraryDirectory(dirName))
        {
            continue;
        }
        auto libraryModel = polaris::native::PSLibraryModel(dirName);
        auto metadataFilePath = polaris::base::JoinFilePath({this->baseUrl, dirName, "metadata.yaml"});
        if (polaris::base::IsFileExist(metadataFilePath))
        {
            auto yamlHandler = polaris::base::YamlHandler(metadataFilePath);
            libraryModel.URN = yamlHandler.getString("metadata.urn").value_or("");
            libraryModel.Title = yamlHandler.getString("metadata.title").value_or(dirName);
            libraryModel.Description = yamlHandler.getString("metadata.description").value_or("");
            libraryModel.Image = yamlHandler.getString("metadata.image").value_or("");
        }
        if (libraryModel.URN.empty())
        {
            libraryModel.URN = polaris::base::calcMd5(entry.path().string());
        }
        libraries->emplace_back(libraryModel);
    }

    return libraries;
}

bool polaris::native::isLibraryDirectory(const std::string& directoryName)
{
    return polaris::base::PSString::EndsWith(directoryName, ".notelibrary");
}
