#pragma once

#include <format>
#include <string>

namespace native::utils
{
    class StringUtils
    {
    public:
        template <typename... Args>
        static std::string DynamicPrint(std::string_view rt_fmt_str, Args&&... args);
        static bool IsBlank(const std::string& str);
        static bool StartsWith(const std::string& str, const std::string& prefix);
        static bool EndsWith(const std::string& str, const std::string& suffix);
    };
}
