//
// Created by ubuntu on 2/13/22.
//

#ifndef SFX_SERVER_API_PQ_H
#define SFX_SERVER_API_PQ_H

#include "server/models/article.h"
#include <vector>

std::vector<ArticleModel> selectArticles();
ArticleModel queryArticle(std::string pk);

#endif // SFX_SERVER_API_PQ_H
