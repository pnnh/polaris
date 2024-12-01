
#include "library.h"
#include <string>
#include <filesystem>
#include "galaxy/quantum/types/String.h"

#include "galaxy/quantum/types/Exception.h"
#include "galaxy/quantum/services/filesystem/filesystem.h"
#include "galaxy/quantum/services/logger/logger.h"
#include "huable/starlight/services/yaml/yaml.h"
#include "galaxy/quantum/utils/md5.h"

huable::starlight::LibraryServerBusiness::LibraryServerBusiness(const std::string& baseUrl)
{
    this->baseUrl = baseUrl;
}

std::shared_ptr<std::vector<huable::starlight::PSLibraryModel>>
huable::starlight::LibraryServerBusiness::selectLibraries() const
{
    auto libraries = std::make_shared<std::vector<huable::starlight::PSLibraryModel>>();

    for (const auto& entry : std::filesystem::directory_iterator(this->baseUrl))
    {
        auto dirName = entry.path().filename();
        if (entry.path() == "." || entry.path() == ".." || !entry.is_directory())
        {
            continue;
        }

        auto filePath = dirName.string();
        if (!isLibraryDirectory(filePath))
        {
            continue;
        }
        auto libraryModel = huable::starlight::PSLibraryModel(filePath);
        auto metadataFilePath = quantum::JoinFilePath({this->baseUrl, filePath, "metadata.yaml"});
        if (quantum::IsFileExist(metadataFilePath))
        {
            auto yamlHandler = quantum::YamlHandler(metadataFilePath);
            libraryModel.URN = yamlHandler.getString("metadata.urn").value_or("");
            libraryModel.Title = yamlHandler.getString("metadata.title").value_or(filePath);
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

bool huable::starlight::isLibraryDirectory(const std::string& directoryName)
{
    return quantum::PSString::EndsWith(directoryName, ".notelibrary");
}
