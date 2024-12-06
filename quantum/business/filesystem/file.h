#pragma once
#include <vector>
#include <memory>
#include "quantum/models/files/File.h"

namespace quantum
{
    class FileServerBusiness
    {
    public:
        explicit FileServerBusiness(const std::string& baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<PSFileModel>> selectFiles() const;
        [[nodiscard]] std::shared_ptr<std::vector<PSFileModel>> selectFiles(std::string parentPath) const;

#if defined(__clang__)
        [[nodiscard]] std::vector<PSFileModel> selectFilesVector() const;
        [[nodiscard]] std::vector<PSFileModel> selectFilesVector(std::string parentPath) const;
#endif

    private:
        std::string baseUrl;
    };
}
