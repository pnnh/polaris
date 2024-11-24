#pragma once
#include <vector>

#include "calieo/telescope/models/files/File.h"

namespace polaris::native
{
    class FileServerBusiness
    {
    public:
        explicit FileServerBusiness(const std::string &baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<native::PSFileModel>> selectFiles() const;
        [[nodiscard]] std::shared_ptr<std::vector<native::PSFileModel>> selectFiles(std::string parentPath) const;

    private:
        std::string baseUrl;
    };

    class FileClientBusiness
    {
    public:
        FileClientBusiness();

        ~FileClientBusiness();

        std::shared_ptr<std::vector<native::PSFileModel>> selectFiles();
    };
}
