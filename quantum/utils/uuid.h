#pragma once

#include <regex>
#include <string>

namespace quantum {

class UUIDHelper
{
public:
    static bool isUUID(const std::string &uuid_string);

private:
    static std::regex uuid_regex;
};

}