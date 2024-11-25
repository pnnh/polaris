#include "file.h"
#include <string>
#include <filesystem>
#include <utility>
#include "quantum/services/filesystem/filesystem.h"
#include "quantum/types/datetime.h"
#include "quantum/utils/md5.h"
#include "quantum/types//String.h"

huable::starlight::FileServerBusiness::FileServerBusiness(const std::string& baseUrl)
{
    this->baseUrl = baseUrl;
}

std::shared_ptr<std::vector<huable::starlight::PSFileModel>>
huable::starlight::FileServerBusiness::selectFiles() const
{
    return selectFiles("");
}

std::shared_ptr<std::vector<huable::starlight::PSFileModel>>
huable::starlight::FileServerBusiness::selectFiles(std::string parentPath) const
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

        auto fileModel = huable::starlight::PSFileModel(dirName);
        if (fileModel.URN.empty())
        {
            fileModel.URN = quantum::calcMd5(entry.path().string());
        }
        fileModel.IsDir = entry.is_directory();
        fileModel.IsHidden = quantum::isHidden(dirName);
        fileModel.IsIgnore = quantum::isIgnore(dirName);
        fileModel.Title = dirName;
        fileModel.Name = dirName;

        fileModel.UpdateTime = quantum::convertFilesystemTime(std::filesystem::last_write_time(entry));
        fileModel.CreateTime = fileModel.UpdateTime;
        files->emplace_back(fileModel);
    }

    return files;
}
