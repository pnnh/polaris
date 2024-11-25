#pragma once

#include <workflow/WFTaskFactory.h>

namespace huable::server
{
    void HandleArticles(WFHttpTask* httpTask);
    void HandleArticleGet(WFHttpTask* httpTask);
}
