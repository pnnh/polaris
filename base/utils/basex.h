#pragma once
#include <string>

namespace polaris::base
{
    std::string decode64(const std::string& val);
    std::string encode64(const std::string& val);
}
