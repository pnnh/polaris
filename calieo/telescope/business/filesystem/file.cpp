#include "file.h"
#include <string>
#include <filesystem>
#include <utility>
#include "galaxy/quantum/services/filesystem/filesystem.h"
#include "galaxy/quantum/types/datetime.h"
#include "galaxy/quantum/utils/md5.h"
#include "galaxy/quantum/types//String.h"

calieo::telescope::FileServerBusiness::FileServerBusiness(const std::string& baseUrl)
{
    this->baseUrl = baseUrl;
}

std::shared_ptr<std::vector<calieo::telescope::PSFileModel>>
calieo::telescope::FileServerBusiness::selectFiles() const
{
    return selectFiles("");
}

std::shared_ptr<std::vector<calieo::telescope::PSFileModel>>
calieo::telescope::FileServerBusiness::selectFiles(std::string parentPath) const
{
    auto files = std::make_shared<std::vector<PSFileModel>>();

    const std::string fullPath = quantum::JoinFilePath({this->baseUrl, std::move(parentPath)});

    for (const auto& entry : std::filesystem::directory_iterator(fullPath))
    {
        auto dirName = entry.path().filename();
        if (entry.path() == "." || entry.path() == "..")
        {
            continue;
        }

        auto filePath = dirName.string();
        auto fileModel = calieo::telescope::PSFileModel(filePath);
        if (fileModel.URN.empty())
        {
            fileModel.URN = quantum::calcMd5(entry.path().string());
        }
        fileModel.IsDir = entry.is_directory();
        fileModel.IsHidden = quantum::isHidden(filePath);
        fileModel.IsIgnore = quantum::isIgnore(filePath);
        fileModel.Title = filePath;
        fileModel.Name = filePath;

        fileModel.UpdateTime = quantum::convertFilesystemTime(std::filesystem::last_write_time(entry));
        fileModel.CreateTime = fileModel.UpdateTime;
        files->emplace_back(fileModel);
    }

    return files;
}
