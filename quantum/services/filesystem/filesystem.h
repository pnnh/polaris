#pragma once

#include <string>
#include <chrono>
#include <filesystem>

namespace quantum
{
    bool IsFileExist(const std::string& filePath);

    std::string JoinFilePath(std::initializer_list<std::string> pathList);

    std::time_t convertFilesystemTime(std::filesystem::file_time_type fileTime);

    bool isHidden(const std::string& path);
    bool isIgnore(const std::string& path);

    // 返回不同平台下的用户主目录
    std::string UserHomeDirectory();
}
