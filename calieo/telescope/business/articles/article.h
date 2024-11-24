#pragma once

#include <vector>
#include "calieo/telescope/models/articles/Article.h"

namespace calieo::telescope
{
    bool isArticleDirectory(const std::string& directoryName);

    class ArticleServerBusiness
    {
    public:
        explicit ArticleServerBusiness(const std::string& baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<calieo::telescope::PSArticleModel>> selectArticles() const;

    private:
        std::string baseUrl;
    };
}
