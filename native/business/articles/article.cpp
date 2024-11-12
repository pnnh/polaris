#include "article.h"

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

business::articles::ArticleServerBusiness::ArticleServerBusiness(const std::string& baseUrl)
{
    this->baseUrl = baseUrl;
}

std::shared_ptr<std::vector<models::articles::PSArticleModel>>
business::articles::ArticleServerBusiness::selectArticles() const
{
    auto libraries = std::make_shared<std::vector<models::articles::PSArticleModel>>();

    for (const auto& entry : std::filesystem::directory_iterator(this->baseUrl))
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
        auto articleModel = models::articles::PSArticleModel(dirName);
        auto metadataFilePath = services::filesystem::JoinFilePath({this->baseUrl, dirName, "metadata.yaml"});
        if (services::filesystem::IsFileExist(metadataFilePath))
        {
            auto yamlHandler = services::yaml::YamlHandler(metadataFilePath);
            articleModel.URN = yamlHandler.getString("metadata.urn").value_or("");
            articleModel.Title = yamlHandler.getString("metadata.title").value_or(dirName);
            articleModel.Description = yamlHandler.getString("metadata.description").value_or("");
            articleModel.Image = yamlHandler.getString("metadata.image").value_or("");
        }
        if (articleModel.URN.empty())
        {
            articleModel.URN = utils::calcMd5(entry.path().string());
        }
        libraries->emplace_back(articleModel);
    }

    return libraries;
}

bool business::articles::isArticleDirectory(const std::string& directoryName)
{
    return utils::StringUtils::EndsWith(directoryName, ".note");
}
