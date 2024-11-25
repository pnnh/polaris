#include "article.h"

#include <string>
#include <filesystem>
#include <galaxy/quantum/utils/basex.h>

#include "galaxy/quantum/types/Exception.h"
#include "galaxy/quantum/services/filesystem/filesystem.h"
#include "huable/starlight/services/yaml/yaml.h"
#include "galaxy/quantum/utils/md5.h"
#include "galaxy/quantum/types/String.h"

huable::starlight::ArticleServerBusiness::ArticleServerBusiness(const std::string& baseUrl)
{
    this->baseUrl = baseUrl;
}

std::shared_ptr<std::vector<huable::starlight::PSArticleModel>>
huable::starlight::ArticleServerBusiness::selectArticles(const std::string& chanURN) const
{
    auto libraries = std::make_shared<std::vector<PSArticleModel>>();
    auto chanPath = quantum::decode64(chanURN);

    auto fullPath = quantum::JoinFilePath({this->baseUrl, chanPath});
    for (const auto& entry : std::filesystem::directory_iterator(fullPath))
    {
        auto dirName = entry.path().filename();
        if (entry.path() == "." || entry.path() == ".." || !entry.is_directory())
        {
            continue;
        }

        if (!isArticleDirectory(dirName))
        {
            continue;
        }
        auto articleModel = PSArticleModel(dirName);
        auto metadataFilePath = quantum::JoinFilePath({fullPath, "metadata.yaml"});
        if (quantum::IsFileExist(metadataFilePath))
        {
            auto yamlHandler = quantum::YamlHandler(metadataFilePath);
            articleModel.Title = yamlHandler.getString("metadata.title").value_or(dirName);
            articleModel.Description = yamlHandler.getString("metadata.description").value_or("");
            articleModel.Image = yamlHandler.getString("metadata.image").value_or("");
        }
        articleModel.URN = quantum::encode64(entry.path().string());

        libraries->emplace_back(articleModel);
    }

    return libraries;
}

std::shared_ptr<huable::starlight::PSArticleModel> huable::starlight::ArticleServerBusiness::getArticle(
    const std::string& chanURN, const std::string& noteURN) const
{
    auto libraries = std::make_shared<PSArticleModel>();

    auto chanPath = quantum::decode64(chanURN);
    auto notePath = quantum::decode64(noteURN);

    auto fullPath = quantum::JoinFilePath({this->baseUrl, chanPath, notePath});
    for (const auto& entry : std::filesystem::directory_iterator(fullPath))
    {
        auto dirName = entry.path().filename();
        if (entry.path() == "." || entry.path() == ".." || !entry.is_directory())
        {
            continue;
        }

        if (!isArticleDirectory(dirName))
        {
            continue;
        }
        auto articleModel = PSArticleModel(dirName);
        auto metadataFilePath = quantum::JoinFilePath({fullPath, "metadata.yaml"});
        if (quantum::IsFileExist(metadataFilePath))
        {
            auto yamlHandler = quantum::YamlHandler(metadataFilePath);
            articleModel.Title = yamlHandler.getString("metadata.title").value_or(dirName);
            articleModel.Description = yamlHandler.getString("metadata.description").value_or("");
            articleModel.Image = yamlHandler.getString("metadata.image").value_or("");
        }
        articleModel.URN = quantum::encode64(entry.path().string());
        articleModel.UpdateTime = quantum::convertFilesystemTime(last_write_time(entry));
        articleModel.CreateTime = quantum::convertFilesystemTime(last_write_time(entry));

        return std::make_shared<PSArticleModel>(articleModel);
    }

    return nullptr;
}

bool huable::starlight::isArticleDirectory(const std::string& directoryName)
{
    return quantum::PSString::EndsWith(directoryName, ".note");
}
