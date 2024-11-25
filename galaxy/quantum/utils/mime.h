#pragma once

#include <string>

namespace quantum
{
    class MimeUtils
    {
    public:
        static bool isImage(const std::string& path);
        static std::string getMimeType(const std::string& path);
    };
}
