#include "Article.h"

huable::starlight::PSArticleModel::PSArticleModel() = default;

huable::starlight::PSArticleModel::PSArticleModel(const std::string& title): Title(title)
{
}

huable::starlight::PSArticleModel::PSArticleModel(const PSArticleModel& other)
= default;
