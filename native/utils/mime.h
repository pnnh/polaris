#pragma once

#include <string>

class MimeUtils
{
public:
    static bool isHidden(const std::string& path);
    static bool isIgnore(const std::string& path);
};
