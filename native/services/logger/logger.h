#pragma once

#include <string>

namespace native::services::logger
{
    class Logger
    {
    public:
        static void LogInfo(const std::string& message);
        static void LogInfo(std::initializer_list<std::string> messageList);
    };
}
