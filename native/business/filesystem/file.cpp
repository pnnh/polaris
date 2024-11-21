#include "file.h"
#include <string>
#include <filesystem>
#include <base/services/filesystem/filesystem.h>
#include <base/types/datetime.h>

#include "base/types/Exception.h"
#include "base/services/filesystem/filesystem.h"
#include "base/services/sqlite/SqliteService.h"
#include "base/services/logger/logger.h"
#include "base/services/yaml/yaml.h"
#include "base/utils/md5.h"
#include "base/types//StringUtils.h"


polaris::native::FileServerBusiness::FileServerBusiness(const std::string& baseUrl)
{
    this->baseUrl = baseUrl;
}

std::shared_ptr<std::vector<polaris::native::PSFileModel>>
polaris::native::FileServerBusiness::selectFiles() const
{
    return selectFiles("");
}

std::shared_ptr<std::vector<polaris::native::PSFileModel>>
polaris::native::FileServerBusiness::selectFiles(std::string parentPath) const
{
    auto files = std::make_shared<std::vector<PSFileModel>>();

    const std::string fullPath = polaris::base::JoinFilePath({this->baseUrl, parentPath});

    for (const auto& entry : std::filesystem::directory_iterator(fullPath))
    {
        auto dirName = entry.path().filename();
        if (entry.path() == "." || entry.path() == "..")
        {
            continue;
        }

        auto fileModel = polaris::native::PSFileModel(dirName);
        if (fileModel.URN.empty())
        {
            fileModel.URN = polaris::base::calcMd5(entry.path().string());
        }
        fileModel.IsDir = entry.is_directory();
        fileModel.Title = dirName;


        auto lastWriteTime = std::filesystem::last_write_time(entry);

        auto sctp = std::chrono::time_point_cast<std::chrono::system_clock::duration>(
            lastWriteTime - std::filesystem::file_time_type::clock::now()
            + std::chrono::system_clock::now());
        auto timePoint = std::chrono::system_clock::to_time_t(sctp);

        fileModel.CreateTime = polaris::base::convertFilesystemTime(std::filesystem::last_write_time(entry));
        files->emplace_back(fileModel);
    }

    return files;
}
