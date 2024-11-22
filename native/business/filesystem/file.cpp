#include "file.h"
#include <string>
#include <filesystem>
#include <utility>
#include <base/services/filesystem/filesystem.h>
#include <base/types/datetime.h>
#include "base/utils/md5.h"
#include "base/types//String.h"

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

    const std::string fullPath = polaris::base::JoinFilePath({this->baseUrl, std::move(parentPath)});

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
        fileModel.IsHidden = polaris::base::isHidden(dirName);
        fileModel.IsIgnore = polaris::base::isIgnore(dirName);
        fileModel.Title = dirName;
        fileModel.Name = dirName;

        fileModel.UpdateTime = polaris::base::convertFilesystemTime(std::filesystem::last_write_time(entry));
        fileModel.CreateTime = fileModel.UpdateTime;
        files->emplace_back(fileModel);
    }

    return files;
}
