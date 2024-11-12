#include "Article.h"

namespace articles = native::models::articles;

articles::PSArticleModel::PSArticleModel() = default;

articles::PSArticleModel::PSArticleModel(const std::string& title): Title(title)
{
}

