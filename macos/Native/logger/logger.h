#pragma once

#include <string>

namespace polaris::macos
{
    class Logger
    {
    public:
        static void log(const std::string& message);
    };
}
