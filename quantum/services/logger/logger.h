#pragma once

#include <string>
#include "quantum/build.h"

namespace quantum
{
    class MTAPI_EXPORT Logger
    {
    public:
        static void LogInfo(const std::string& message);
        static void LogInfo(std::initializer_list<std::string> messageList);
    };
}
