#pragma once

#include <string>
#include <chrono>
#include <filesystem>

namespace polaris::base
{
    bool IsFileExist(const std::string& filePath);

    std::string JoinFilePath(std::initializer_list<std::string> pathList);

    std::time_t convertFilesystemTime(std::filesystem::file_time_type fileTime);
}
