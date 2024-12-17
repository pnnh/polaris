#pragma once

#include <string>

namespace native {
    class Logger {
    public:
        static void log(const std::string& message);
    };
}