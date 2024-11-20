#include "notebook.h"

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

business::articles::NotebookServerBusiness::NotebookServerBusiness(const std::string& baseUrl)
{
    this->baseUrl = baseUrl;
}

std::shared_ptr<std::vector<models::articles::PSNotebookModel>>
business::articles::NotebookServerBusiness::selectNotebooks() const
{
    auto libraries = std::make_shared<std::vector<models::articles::PSNotebookModel>>();

    for (const auto& entry : std::filesystem::directory_iterator(this->baseUrl))
    {
        auto dirName = entry.path().filename();
        if (entry.path() == "." || entry.path() == ".." || !entry.is_directory())
        {
            continue;
        }

        if (!isNotebookDirectory(dirName))
        {
            continue;
        }
        auto notebookModel = models::articles::PSNotebookModel(dirName);
        auto metadataFilePath = services::filesystem::JoinFilePath({this->baseUrl, dirName, "metadata.yaml"});
        if (services::filesystem::IsFileExist(metadataFilePath))
        {
            auto yamlHandler = services::yaml::YamlHandler(metadataFilePath);
            notebookModel.URN = yamlHandler.getString("metadata.urn").value_or("");
            notebookModel.Title = yamlHandler.getString("metadata.title").value_or(dirName);
            notebookModel.Description = yamlHandler.getString("metadata.description").value_or("");
            notebookModel.Image = yamlHandler.getString("metadata.image").value_or("");
        }
        if (notebookModel.URN.empty())
        {
            notebookModel.URN = utils::calcMd5(entry.path().string());
        }
        libraries->emplace_back(notebookModel);
    }

    return libraries;
}

bool business::articles::isNotebookDirectory(const std::string& directoryName)
{
    return native::StringUtils::EndsWith(directoryName, ".notebook");
}
