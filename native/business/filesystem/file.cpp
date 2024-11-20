#include "file.h"
#include <string>
#include <filesystem>
#include "native/models/protocol/Exception.h"
#include "native/services/filesystem/filesystem.h"
#include "native/services/sqlite/SqliteService.h"
#include "native/services/logger/logger.h"
#include "native/services/yaml/yaml.h"
#include "native/utils/md5.h"
#include "native/utils/StringUtils.h"

namespace models = native::models;
namespace services = native::services;
namespace logger = services::logger;

native::FileServerBusiness::FileServerBusiness(const std::string &baseUrl)
{
    this->baseUrl = baseUrl;
}

std::shared_ptr<std::vector<models::PSFileModel>>
native::FileServerBusiness::selectFiles() const
{
    return selectFiles("");
}

std::shared_ptr<std::vector<models::PSFileModel>>
native::FileServerBusiness::selectFiles(std::string parentPath) const
{
    auto files = std::make_shared<std::vector<models::PSFileModel>>();

    const std::string fullPath = services::filesystem::JoinFilePath({this->baseUrl, parentPath});

    for (const auto &entry : std::filesystem::directory_iterator(fullPath))
    {
        auto dirName = entry.path().filename();
        if (entry.path() == "." || entry.path() == "..")
        {
            continue;
        }

        auto fileModel = models::PSFileModel(dirName);
        if (fileModel.URN.empty())
        {
            fileModel.URN = utils::calcMd5(entry.path().string());
        }
        fileModel.IsDir = entry.is_directory();
        fileModel.Title = dirName;
        files->emplace_back(fileModel);
    }

    return files;
}