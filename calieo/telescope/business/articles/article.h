#pragma once

#include <vector>
#include "calieo/telescope/models/articles/Article.h"

namespace polaris::native
{
    bool isArticleDirectory(const std::string& directoryName);

    class ArticleServerBusiness
    {
    public:
        explicit ArticleServerBusiness(const std::string& baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<polaris::native::PSArticleModel>> selectArticles() const;

    private:
        std::string baseUrl;
    };
}
