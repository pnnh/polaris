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
    };
}
