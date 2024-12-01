#include "article.h"

#include <string>
#include <filesystem>
#include <utility>
#include <galaxy/quantum/services/database/SqliteService.h>
#include <galaxy/quantum/utils/basex.h>

#include "galaxy/quantum/types/Exception.h"
#include "galaxy/quantum/services/filesystem/filesystem.h"
#include "huable/starlight/services/yaml/yaml.h"
#include "galaxy/quantum/utils/md5.h"
#include "galaxy/quantum/types/String.h"

huable::starlight::ArticleFileService::ArticleFileService(const std::string& baseUrl)
{
    this->baseUrl = baseUrl;
}

huable::starlight::PSArticleModel huable::starlight::ArticleFileService::ParseArticle(
    const std::string& chanURN, const std::string& fullPath) const
{
    auto articleModel = huable::starlight::PSArticleModel("");
    auto metadataFilePath = quantum::JoinFilePath({fullPath, "metadata.yaml"});
    if (quantum::IsFileExist(metadataFilePath))
    {
        auto yamlHandler = quantum::YamlHandler(metadataFilePath);
        articleModel.URN = quantum::PSString::toLower(yamlHandler.getString("metadata.urn").value_or(""));
        articleModel.Title = yamlHandler.getString("metadata.title").value_or("");
        articleModel.Description = yamlHandler.getString("metadata.description").value_or("");
        articleModel.Image = yamlHandler.getString("metadata.image").value_or("");
    }
    if (articleModel.URN.empty())
    {
        articleModel.URN = quantum::PSString::toLower(quantum::calcMd5(fullPath));
    }
    if (articleModel.Title.empty())
    {
        articleModel.Title = quantum::PathFileName(fullPath);
    }
    articleModel.Channel = chanURN;
    articleModel.Path = fullPath;
    articleModel.UpdateTime = quantum::fileLastModifyTime(fullPath);

    return articleModel;
}

std::shared_ptr<std::vector<huable::starlight::PSArticleModel>>
huable::starlight::ArticleFileService::scanArticles(const std::string& chanURN, const std::string& chanPath) const
{
    auto libraries = std::make_shared<std::vector<PSArticleModel>>();

    auto chanFullPath = quantum::JoinFilePath({this->baseUrl, chanPath});
    for (const auto& entry : std::filesystem::directory_iterator(chanFullPath))
    {
        auto dirName = entry.path().filename();
        if (entry.path() == "." || entry.path() == ".." || !entry.is_directory())
        {
            continue;
        }

        auto filePath = dirName.string();
        if (!isArticleDirectory(filePath))
        {
            continue;
        }
        auto noteFullPath = quantum::JoinFilePath({this->baseUrl, chanPath, filePath});
        auto articleModel = ParseArticle(chanURN, noteFullPath);

        libraries->emplace_back(articleModel);
    }

    return libraries;
}

bool huable::starlight::isArticleDirectory(const std::string& directoryName)
{
    return quantum::PSString::EndsWith(directoryName, ".note");
}

huable::starlight::ArticleSqliteService::ArticleSqliteService(std::string dbPath): dbPath(std::move(dbPath))
{
}

std::shared_ptr<std::vector<huable::starlight::PSArticleModel>> huable::starlight::ArticleSqliteService::selectArticles(
    const std::string& chanURN) const
{
    auto sqliteService = quantum::SqliteService(this->dbPath);

    std::string sqlText = "SELECT * FROM articles ";
    auto sqlCommand = sqliteService.createCommand(sqlText);
    if (!chanURN.empty())
    {
        sqlText += " where channel=$chan ";
        sqlCommand->ChangeSqlText(sqlText);
        sqlCommand->BindString("$chan", chanURN);
    }
    auto libraries = std::make_shared<std::vector<PSArticleModel>>();
    auto sqlResult = sqlCommand->Run();
    if (sqlResult == nullptr)
    {
        std::cout << "sqlResult is empty" << std::endl;
        return nullptr;
    }
    auto rowCount = sqlResult->getRowCount();
    if (rowCount < 1)
    {
        std::cout << "table is empty" << std::endl;
        return libraries;
    }

    for (auto rowIndex = 0; rowIndex < rowCount; ++rowIndex)
    {
        auto model = PSArticleModel();
        model.URN = sqlResult->getColumn(rowIndex, "urn").value().getStringValue();
        model.Title = sqlResult->getColumn(rowIndex, "title").value().getStringValue();

        libraries->emplace_back(model);
    }

    return libraries;
}

std::shared_ptr<huable::starlight::PSArticleModel> huable::starlight::ArticleSqliteService::getArticle(
    const std::string& noteURN) const
{
    auto sqliteService = quantum::SqliteService(this->dbPath);

    std::string sqlText = "SELECT * FROM articles where urn=$urn ";
    auto sqlCommand = sqliteService.createCommand(sqlText);
    sqlCommand->BindString("$urn", noteURN);
    auto sqlResult = sqlCommand->Run();
    if (sqlResult == nullptr)
    {
        std::cout << "sqlResult is empty" << std::endl;
        return nullptr;
    }
    auto rowCount = sqlResult->getRowCount();
    if (rowCount < 1)
    {
        std::cout << "table is empty" << std::endl;
        return nullptr;
    }

    auto model = PSArticleModel();
    model.URN = sqlResult->getColumn(0, "urn").value().getStringValue();
    model.Title = sqlResult->getColumn(0, "title").value().getStringValue();

    return std::make_shared<PSArticleModel>(model);
}


