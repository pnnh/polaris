#pragma once
#include <vector>

#include "huable/starlight/models/files/File.h"

namespace huable::starlight
{
    class FileServerBusiness
    {
    public:
        explicit FileServerBusiness(const std::string &baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<huable::starlight::PSFileModel>> selectFiles() const;
        [[nodiscard]] std::shared_ptr<std::vector<huable::starlight::PSFileModel>> selectFiles(std::string parentPath) const;

    private:
        std::string baseUrl;
    };

    class FileClientBusiness
    {
    public:
        FileClientBusiness();

        ~FileClientBusiness();

        std::shared_ptr<std::vector<huable::starlight::PSFileModel>> selectFiles();
    };
}
