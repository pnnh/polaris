#include "article.h"

#include <string>
#include <filesystem>
#include "quantum/types/Exception.h"
#include "quantum/services/filesystem/filesystem.h"
#include "quantum/services/logger/logger.h"
#include "calieo/telescope/services/yaml/yaml.h"
#include "quantum/utils/md5.h"
#include "quantum/types/String.h"

polaris::native::ArticleServerBusiness::ArticleServerBusiness(const std::string& baseUrl)
{
    this->baseUrl = baseUrl;
}

std::shared_ptr<std::vector<polaris::native::PSArticleModel>>
polaris::native::ArticleServerBusiness::selectArticles() const
{
    auto libraries = std::make_shared<std::vector<polaris::native::PSArticleModel>>();

    for (const auto& entry : std::filesystem::directory_iterator(this->baseUrl))
    {
        auto dirName = entry.path().filename();
        if (entry.path() == "." || entry.path() == ".." || !entry.is_directory())
        {
            continue;
        }

        if (!polaris::native::isArticleDirectory(dirName))
        {
            continue;
        }
        auto articleModel = polaris::native::PSArticleModel(dirName);
        auto metadataFilePath = quantum::JoinFilePath({this->baseUrl, dirName, "metadata.yaml"});
        if (quantum::IsFileExist(metadataFilePath))
        {
            auto yamlHandler = quantum::YamlHandler(metadataFilePath);
            articleModel.URN = yamlHandler.getString("metadata.urn").value_or("");
            articleModel.Title = yamlHandler.getString("metadata.title").value_or(dirName);
            articleModel.Description = yamlHandler.getString("metadata.description").value_or("");
            articleModel.Image = yamlHandler.getString("metadata.image").value_or("");
        }
        if (articleModel.URN.empty())
        {
            articleModel.URN = quantum::calcMd5(entry.path().string());
        }
        libraries->emplace_back(articleModel);
    }

    return libraries;
}

bool polaris::native::isArticleDirectory(const std::string& directoryName)
{
    return quantum::PSString::EndsWith(directoryName, ".note");
}
