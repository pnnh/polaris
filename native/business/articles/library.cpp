
#include "library.h"
#include <string>
#include <filesystem>
#include "native/models/protocol/Exception.h"
#include "native/services/filesystem/filesystem.h"
#include "native/services/logger/logger.h"
#include "native/services/yaml/yaml.h"
#include "native/utils/md5.h"
#include "native/utils/StringUtils.h"

namespace models = native::models;
namespace business = native::business;
namespace services = native::services;
namespace logger = services::logger;

business::articles::LibraryServerBusiness::LibraryServerBusiness(const std::string& baseUrl)
{
    this->baseUrl = baseUrl;
}

std::shared_ptr<std::vector<models::articles::PSLibraryModel>>
business::articles::LibraryServerBusiness::selectLibraries() const
{
    auto libraries = std::make_shared<std::vector<models::articles::PSLibraryModel>>();

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
        auto libraryModel = models::articles::PSLibraryModel(dirName);
        auto metadataFilePath = services::filesystem::JoinFilePath({this->baseUrl, dirName, "metadata.yaml"});
        if (services::filesystem::IsFileExist(metadataFilePath))
        {
            auto yamlHandler = services::yaml::YamlHandler(metadataFilePath);
            libraryModel.URN = yamlHandler.getString("metadata.urn").value_or("");
            libraryModel.Title = yamlHandler.getString("metadata.title").value_or(dirName);
            libraryModel.Description = yamlHandler.getString("metadata.description").value_or("");
            libraryModel.Image = yamlHandler.getString("metadata.image").value_or("");
        }
        if (libraryModel.URN.empty())
        {
            libraryModel.URN = utils::calcMd5(entry.path().string());
        }
        libraries->emplace_back(libraryModel);
    }

    return libraries;
}

bool business::articles::isLibraryDirectory(const std::string& directoryName)
{
    return utils::StringUtils::EndsWith(directoryName, ".notelibrary");
}
