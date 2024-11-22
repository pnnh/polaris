#include "String.h"

#include <algorithm>
#include <sstream>
#include <utility>

template <typename... Args>
std::string polaris::base::PSString::DynamicPrint(std::string_view rt_fmt_str, Args&&... args)
{
    return std::vformat(rt_fmt_str, std::make_format_args(args...));
}

bool polaris::base::PSString::IsBlank(const std::string& str)
{
    return str.empty() || std::all_of(str.begin(), str.end(), [](unsigned char c) { return std::isspace(c); });
}

bool polaris::base::PSString::StartsWith(const std::string& str, const std::string& prefix)
{
    return str.size() >= prefix.size() && str.compare(0, prefix.size(), prefix) == 0;
}

std::string polaris::base::PSString::LeftReplace(const std::string& str, const std::string& prefix,
                                                 const std::string& newPrefix)
{
    if (StartsWith(str, prefix))
    {
        return newPrefix + str.substr(prefix.size());
    }
    return str;
}

bool polaris::base::PSString::EndsWith(const std::string& str, const std::string& suffix)
{
    return str.size() >= suffix.size() && str.compare(str.size() - suffix.size(), suffix.size(), suffix) == 0;
}

std::vector<std::string> polaris::base::PSString::Split(const std::string& str, char delimiter)
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

std::string polaris::base::PSString::toLower(const std::string& str)
{
    auto newStr = std::string(str);
    std::ranges::transform(newStr, newStr.begin(), ::tolower);
    return newStr;
}

std::string polaris::base::PSString::toUpper(const std::string& str)
{
    auto newStr = std::string(str);
    std::ranges::transform(newStr, newStr.begin(), ::toupper);
    return newStr;
}

polaris::base::PSString::PSString() = default;

polaris::base::PSString::PSString(std::string stdString): stringValue(std::move(stdString))
{
}

polaris::base::PSString& polaris::base::PSString::operator=(const PSString& other) = default;
