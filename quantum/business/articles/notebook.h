#pragma once

#include <vector>
#include "quantum/models/articles/Notebook.h"

namespace quantum
{
    bool isNotebookDirectory(const std::string& directoryName);

    class NotebookServerBusiness
    {
    public:
        explicit NotebookServerBusiness(const std::string& baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<quantum::PSNotebookModel>> selectNotebooks() const;

    private:
        std::string baseUrl;
    };
}
