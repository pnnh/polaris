#pragma once
#include <vector>
#include "quantum/models/articles/Library.h"

namespace quantum
{
    bool isLibraryDirectory(const std::string& directoryName);

    class LibraryServerBusiness
    {
    public:
        explicit LibraryServerBusiness(const std::string& baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<quantum::PSLibraryModel>> selectLibraries() const;

    private:
        std::string baseUrl;
    };
}
