#include "StringUtils.h"

#include <algorithm>
#include <sstream>

template <typename... Args>
std::string polaris::base::StringUtils::DynamicPrint(std::string_view rt_fmt_str, Args&&... args)
{
    return std::vformat(rt_fmt_str, std::make_format_args(args...));
}

bool polaris::base::StringUtils::IsBlank(const std::string& str)
{
    return str.empty() || std::all_of(str.begin(), str.end(), [](unsigned char c) { return std::isspace(c); });
}

bool polaris::base::StringUtils::StartsWith(const std::string& str, const std::string& prefix)
{
    return str.size() >= prefix.size() && str.compare(0, prefix.size(), prefix) == 0;
}

bool polaris::base::StringUtils::EndsWith(const std::string& str, const std::string& suffix)
{
    return str.size() >= suffix.size() && str.compare(str.size() - suffix.size(), suffix.size(), suffix) == 0;
}

std::vector<std::string> polaris::base::StringUtils::Split(const std::string& str, char delimiter)
{
    std::vector<std::string> stringList;
    std::istringstream iss(str);
    std::string s;
    while (getline(iss, s, delimiter))
    {
        stringList.push_back(s);
    }
    return stringList;
}

std::string polaris::base::StringUtils::toLower(const std::string& str)
{
    auto newStr = std::string(str);
    std::ranges::transform(newStr, newStr.begin(), ::tolower);
    return newStr;
}

std::string polaris::base::StringUtils::toUpper(const std::string& str)
{
    auto newStr = std::string(str);
    std::ranges::transform(newStr, newStr.begin(), ::toupper);
    return newStr;
}