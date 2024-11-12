#pragma once

#include <vector>
#include "native/models/articles/Article.h"

namespace native::business::articles
{
    bool isArticleDirectory(const std::string& directoryName);

    class ArticleServerBusiness
    {
    public:
        explicit ArticleServerBusiness(const std::string& baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<models::articles::PSArticleModel>> selectArticles() const;

    private:
        std::string baseUrl;
    };
}
