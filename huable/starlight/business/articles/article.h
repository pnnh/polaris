#pragma once

#include <vector>
#include "huable/starlight/models/articles/Article.h"

namespace huable::starlight
{
    bool isArticleDirectory(const std::string& directoryName);

    class ArticleServerBusiness
    {
    public:
        explicit ArticleServerBusiness(const std::string& baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<huable::starlight::PSArticleModel>> selectArticles() const;

    private:
        std::string baseUrl;
    };
}
