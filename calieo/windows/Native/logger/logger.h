#pragma once

#include <string>

namespace calieo::windows {
    class Logger {
    public:
        static void log(const std::string& message);
    };
}