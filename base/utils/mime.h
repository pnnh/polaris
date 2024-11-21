#pragma once

#include <string>

namespace polaris::base
{
    class MimeUtils
    {
    public:
        static bool isImage(const std::string& path);
        static bool isHidden(const std::string& path);
        static bool isIgnore(const std::string& path);
        static std::string getMimeType(const std::string& path);
    };
}
