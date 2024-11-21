#pragma once

#include <boost/asio.hpp>
#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <cstdlib>
#include <ctime>

#include "workflow/WFTaskFactory.h"

namespace polaris::server
{
    void HandleFileList(WFHttpTask* httpTask);
}
