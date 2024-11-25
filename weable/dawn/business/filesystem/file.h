#pragma once
#include <vector>

#include "calieo/telescope/models/files/File.h"

namespace calieo::telescope
{
    class FileServerBusiness
    {
    public:
        explicit FileServerBusiness(const std::string &baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<calieo::telescope::PSFileModel>> selectFiles() const;
        [[nodiscard]] std::shared_ptr<std::vector<calieo::telescope::PSFileModel>> selectFiles(std::string parentPath) const;

    private:
        std::string baseUrl;
    };

    class FileClientBusiness
    {
    public:
        FileClientBusiness();

        ~FileClientBusiness();

        std::shared_ptr<std::vector<calieo::telescope::PSFileModel>> selectFiles();
    };
}
