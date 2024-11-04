#pragma once

#include <regex>
#include <string>

class UUIDHelper
{
public:
    static bool isUUID(const std::string &uuid_string);

private:
    static std::regex uuid_regex;
};
