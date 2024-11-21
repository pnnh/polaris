#pragma once

#include <string>

namespace polaris::base
{
    class Logger
    {
    public:
        static void LogInfo(const std::string& message);
        static void LogInfo(std::initializer_list<std::string> messageList);
    };
}
