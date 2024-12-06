#pragma once

#include <string>
#include <filesystem>
#include <quantum/types/datetime.h>

namespace quantum
{
    bool IsFileExist(const std::string& filePath);

    std::string JoinFilePath(std::initializer_list<std::string> pathList);
    std::string PathFileName(const std::string& filePath);

    std::time_t convertFilesystemTime(const std::filesystem::file_time_type& fileTime);
    PSDatetime fileLastModifyTime(const std::string& filePath);

    bool isHidden(const std::string& path);
    bool isIgnore(const std::string& path);

    // 返回不同平台下的用户主目录
    std::string UserHomeDirectory();

    namespace filesystem
    {
        std::string ReadAllText(const std::string& filePath);
    }
}
