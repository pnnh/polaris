#pragma once

#include <vector>
#include "calieo/telescope/models/articles/Notebook.h"

namespace calieo::telescope
{
    bool isNotebookDirectory(const std::string& directoryName);

    class NotebookServerBusiness
    {
    public:
        explicit NotebookServerBusiness(const std::string& baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<calieo::telescope::PSNotebookModel>> selectNotebooks() const;

    private:
        std::string baseUrl;
    };
}
