#pragma once

#include <string>

namespace native::services::filesystem
{
    bool IsFileExist(const std::string& filePath);

    std::string JoinFilePath(std::initializer_list<std::string> pathList);
}
