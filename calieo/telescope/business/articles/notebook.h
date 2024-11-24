#pragma once

#include <vector>
#include "native/models/articles/Notebook.h"

namespace polaris::native
{
    bool isNotebookDirectory(const std::string& directoryName);

    class NotebookServerBusiness
    {
    public:
        explicit NotebookServerBusiness(const std::string& baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<polaris::native::PSNotebookModel>> selectNotebooks() const;

    private:
        std::string baseUrl;
    };
}
