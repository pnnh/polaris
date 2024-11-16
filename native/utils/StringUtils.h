#pragma once

#include <format>
#include <string>
#include <vector>

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
        static std::vector<std::string> Split(const std::string& str, char delimiter);
        static std::string toLower(const std::string& str);
        static std::string toUpper(const std::string& str);
    };
}
