
#include "article.h"
#include "calieo/telescope/business/articles/article.h"

#include <build.h>
#include <quantum/services/logger/logger.h>
#include <spdlog/logger.h>

#include "quantum/services/filesystem/filesystem.h"

int native::examples::articles::TestArticleSelectArticles()
{
    const std::string baseUrl = quantum::JoinFilePath({
        PROJECT_SOURCE_DIR, "assets", "data", "CPlus.notelibrary", "CMake笔记本.notebook"
    });
    auto articleServer = std::make_shared<polaris::native::ArticleServerBusiness>(baseUrl);
    auto articlePtr = articleServer->selectArticles();
    for (const auto& model : *articlePtr)
    {
        quantum::Logger::LogInfo({model.URN, model.Title, model.Title});
    }
    return 0;
}
