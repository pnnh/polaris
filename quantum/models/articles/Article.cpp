#include "Article.h"

quantum::PSArticleModel::PSArticleModel() = default;

quantum::PSArticleModel::PSArticleModel(const std::string& title): Title(title)
{
}

quantum::PSArticleModel::PSArticleModel(const PSArticleModel& other)
= default;
