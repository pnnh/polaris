#include "article.h"

#include <string>
#include <filesystem>
#include "base/types/Exception.h"
#include "base/services/filesystem/filesystem.h"
#include "base/services/logger/logger.h"
#include "base/services/yaml/yaml.h"
#include "base/utils/md5.h"
#include "base/types/String.h"

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
        auto metadataFilePath = polaris::base::JoinFilePath({this->baseUrl, dirName, "metadata.yaml"});
        if (polaris::base::IsFileExist(metadataFilePath))
        {
            auto yamlHandler = polaris::base::YamlHandler(metadataFilePath);
            articleModel.URN = yamlHandler.getString("metadata.urn").value_or("");
            articleModel.Title = yamlHandler.getString("metadata.title").value_or(dirName);
            articleModel.Description = yamlHandler.getString("metadata.description").value_or("");
            articleModel.Image = yamlHandler.getString("metadata.image").value_or("");
        }
        if (articleModel.URN.empty())
        {
            articleModel.URN = polaris::base::calcMd5(entry.path().string());
        }
        libraries->emplace_back(articleModel);
    }

    return libraries;
}

bool polaris::native::isArticleDirectory(const std::string& directoryName)
{
    return polaris::base::PSString::EndsWith(directoryName, ".note");
}
