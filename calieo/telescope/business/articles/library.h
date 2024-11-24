#pragma once
#include <vector>
#include "calieo/telescope/models/articles/Library.h"

namespace calieo::telescope
{
    bool isLibraryDirectory(const std::string& directoryName);

    class LibraryServerBusiness
    {
    public:
        explicit LibraryServerBusiness(const std::string& baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<calieo::telescope::PSLibraryModel>> selectLibraries() const;

    private:
        std::string baseUrl;
    };
}
