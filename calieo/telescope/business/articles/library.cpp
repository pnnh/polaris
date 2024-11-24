
#include "library.h"
#include <string>
#include <filesystem>
#include "quantum/types/String.h"

#include "quantum/types/Exception.h"
#include "quantum/services/filesystem/filesystem.h"
#include "quantum/services/logger/logger.h"
#include "calieo/telescope/services/yaml/yaml.h"
#include "quantum/utils/md5.h"

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
        auto metadataFilePath = quantum::JoinFilePath({this->baseUrl, dirName, "metadata.yaml"});
        if (quantum::IsFileExist(metadataFilePath))
        {
            auto yamlHandler = quantum::YamlHandler(metadataFilePath);
            libraryModel.URN = yamlHandler.getString("metadata.urn").value_or("");
            libraryModel.Title = yamlHandler.getString("metadata.title").value_or(dirName);
            libraryModel.Description = yamlHandler.getString("metadata.description").value_or("");
            libraryModel.Image = yamlHandler.getString("metadata.image").value_or("");
        }
        if (libraryModel.URN.empty())
        {
            libraryModel.URN = quantum::calcMd5(entry.path().string());
        }
        libraries->emplace_back(libraryModel);
    }

    return libraries;
}

bool polaris::native::isLibraryDirectory(const std::string& directoryName)
{
    return quantum::PSString::EndsWith(directoryName, ".notelibrary");
}
