#include "notebook.h"

#include <string>
#include <filesystem>
#include <base/services/filesystem/filesystem.h>
#include <base/services/yaml/yaml.h>
#include "base/utils/md5.h"
#include "base/types/StringUtils.h"

polaris::native::NotebookServerBusiness::NotebookServerBusiness(const std::string& baseUrl)
{
    this->baseUrl = baseUrl;
}

std::shared_ptr<std::vector<polaris::native::PSNotebookModel>>
polaris::native::NotebookServerBusiness::selectNotebooks() const
{
    auto libraries = std::make_shared<std::vector<polaris::native::PSNotebookModel>>();

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
        auto notebookModel = polaris::native::PSNotebookModel(dirName);
        auto metadataFilePath = polaris::base::JoinFilePath({this->baseUrl, dirName, "metadata.yaml"});
        if (polaris::base::IsFileExist(metadataFilePath))
        {
            auto yamlHandler = polaris::base::YamlHandler(metadataFilePath);
            notebookModel.URN = yamlHandler.getString("metadata.urn").value_or("");
            notebookModel.Title = yamlHandler.getString("metadata.title").value_or(dirName);
            notebookModel.Description = yamlHandler.getString("metadata.description").value_or("");
            notebookModel.Image = yamlHandler.getString("metadata.image").value_or("");
        }
        if (notebookModel.URN.empty())
        {
            notebookModel.URN = polaris::base::calcMd5(entry.path().string());
        }
        libraries->emplace_back(notebookModel);
    }

    return libraries;
}

bool polaris::native::isNotebookDirectory(const std::string& directoryName)
{
    return polaris::base::StringUtils::EndsWith(directoryName, ".notebook");
}
