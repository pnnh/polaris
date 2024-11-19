#pragma once
#include <vector>

#include "native/models/files/File.h"

namespace native::business
{
    class FileServerBusiness
    {
    public:
        explicit FileServerBusiness(const std::string &baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<models::PSFileModel>> selectFiles() const;

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
