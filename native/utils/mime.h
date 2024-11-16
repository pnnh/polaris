#pragma once

#include <string>

namespace native::utils
{
    class MimeUtils
    {
    public:
        static bool isImage(const std::string& path);
        static bool isHidden(const std::string& path);
        static bool isIgnore(const std::string& path);
    };
}
