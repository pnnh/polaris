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

        [[nodiscard]] std::shared_ptr<std::vector<PSArticleModel>> selectArticles(const std::string& chanURN) const;
        [[nodiscard]] std::shared_ptr<PSArticleModel> getArticle(const std::string& chanURN,
                                                                 const std::string& noteURN) const;

    private:
        std::string baseUrl;
    };
}
