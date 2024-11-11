#pragma once

#include <string>

namespace native::services::logger
{
    class Logger
    {
    public:
        static void LogInfo(const std::string& message);
    };
}
