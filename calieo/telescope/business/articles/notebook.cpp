#include "notebook.h"

#include <string>
#include <filesystem>
#include "quantum/services/filesystem/filesystem.h"
#include "calieo/telescope/services/yaml/yaml.h"
#include "quantum/utils/md5.h"
#include "quantum/types/String.h"

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
        auto metadataFilePath = quantum::JoinFilePath({this->baseUrl, dirName, "metadata.yaml"});
        if (quantum::IsFileExist(metadataFilePath))
        {
            auto yamlHandler = quantum::YamlHandler(metadataFilePath);
            notebookModel.URN = yamlHandler.getString("metadata.urn").value_or("");
            notebookModel.Title = yamlHandler.getString("metadata.title").value_or(dirName);
            notebookModel.Description = yamlHandler.getString("metadata.description").value_or("");
            notebookModel.Image = yamlHandler.getString("metadata.image").value_or("");
        }
        if (notebookModel.URN.empty())
        {
            notebookModel.URN = quantum::calcMd5(entry.path().string());
        }
        libraries->emplace_back(notebookModel);
    }

    return libraries;
}

bool polaris::native::isNotebookDirectory(const std::string& directoryName)
{
    return quantum::PSString::EndsWith(directoryName, ".notebook");
}
