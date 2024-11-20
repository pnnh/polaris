#pragma once
#include <vector>

#include "native/models/files/File.h"

namespace native
{
    class FileServerBusiness
    {
    public:
        explicit FileServerBusiness(const std::string &baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<models::PSFileModel>> selectFiles() const;
        [[nodiscard]] std::shared_ptr<std::vector<models::PSFileModel>> selectFiles(std::string parentPath) const;

    private:
        std::string baseUrl;
    };

    class FileClientBusiness
    {
    public:
        FileClientBusiness();

        ~FileClientBusiness();

        std::shared_ptr<std::vector<models::PSFileModel>> selectFiles();
    };
}
