#pragma once
#include <vector>
#include "huable/starlight/models/articles/Library.h"

namespace huable::starlight
{
    bool isLibraryDirectory(const std::string& directoryName);

    class LibraryServerBusiness
    {
    public:
        explicit LibraryServerBusiness(const std::string& baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<huable::starlight::PSLibraryModel>> selectLibraries() const;

    private:
        std::string baseUrl;
    };
}
