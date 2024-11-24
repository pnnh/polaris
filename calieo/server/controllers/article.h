#pragma once

#include <workflow/WFTaskFactory.h>

namespace polaris::server
{
    void HandleArticles(WFHttpTask* httpTask);
    void HandleArticleGet(WFHttpTask* httpTask);
}
