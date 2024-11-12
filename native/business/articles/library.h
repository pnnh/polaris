#pragma once
#include <vector>
#include "native/models/articles/Library.h"

namespace native::business::articles
{
    bool isLibraryDirectory(const std::string& directoryName);

    class LibraryServerBusiness
    {
    public:
        explicit LibraryServerBusiness(const std::string& baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<models::articles::PSLibraryModel>> selectLibraries() const;

    private:
        std::string baseUrl;
    };
}
