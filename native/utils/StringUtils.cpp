#include "StringUtils.h"

template <typename... Args>
std::string polaris::native::utils::StringUtils::DynamicPrint(std::string_view rt_fmt_str, Args&&... args)
{
    return std::vformat(rt_fmt_str, std::make_format_args(args...));
}
