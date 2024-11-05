#pragma once

#include <boost/asio.hpp>
#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <cstdlib>
#include <ctime>

#include "workflow/WFTaskFactory.h"

void HandleArticles(WFHttpTask *httpTask);
void HandleArticleGet(WFHttpTask *httpTask);