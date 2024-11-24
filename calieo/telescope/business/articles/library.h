#pragma once
#include <vector>
#include "native/models/articles/Library.h"

namespace polaris::native
{
    bool isLibraryDirectory(const std::string& directoryName);

    class LibraryServerBusiness
    {
    public:
        explicit LibraryServerBusiness(const std::string& baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<polaris::native::PSLibraryModel>> selectLibraries() const;

    private:
        std::string baseUrl;
    };
}
