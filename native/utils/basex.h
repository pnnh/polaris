#pragma once
#include <string>

namespace native::utils
{
    std::string decode64(const std::string& val);
    std::string encode64(const std::string& val);
}
