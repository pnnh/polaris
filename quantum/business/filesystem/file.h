#pragma once
#include <vector>

#include "quantum/models/files/File.h"

namespace quantum
{
    class FileServerBusiness
    {
    public:
        explicit FileServerBusiness(const std::string &baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<quantum::PSFileModel>> selectFiles() const;
        [[nodiscard]] std::shared_ptr<std::vector<quantum::PSFileModel>> selectFiles(std::string parentPath) const;

    private:
        std::string baseUrl;
    };

    class FileClientBusiness
    {
    public:
        FileClientBusiness();

        ~FileClientBusiness();

        std::shared_ptr<std::vector<quantum::PSFileModel>> selectFiles();
    };
}
