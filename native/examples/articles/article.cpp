
#include "article.h"
#include "native/business/articles/article.h"

#include "native/services/filesystem/filesystem.h"
#include "native/services/logger/logger.h"

namespace business = native::business;
namespace logger = native::services::logger;

int native::examples::articles::TestArticleSelectArticles()
{
    const std::string baseUrl = services::filesystem::JoinFilePath({
        "assets", "data", "CPlus.notelibrary", "CMake笔记本.notebook"
    });
    auto articleServer = std::make_shared<business::articles::ArticleServerBusiness>(baseUrl);
    auto articlePtr = articleServer->selectArticles();
    for (const auto& model : *articlePtr)
    {
        logger::Logger::LogInfo({model.URN, model.Title, model.Title});
    }
    return 0;
}
