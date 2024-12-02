#pragma once

#include <workflow/WFTaskFactory.h>

namespace pulsar
{
    void HandleArticles(WFHttpTask* httpTask);
    void HandleArticleGet(WFHttpTask* httpTask);
}
