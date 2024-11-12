#pragma once

#include <vector>
#include "native/models/articles/Notebook.h"

namespace native::business::articles
{
    bool isNotebookDirectory(const std::string& directoryName);

    class NotebookServerBusiness
    {
    public:
        explicit NotebookServerBusiness(const std::string& baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<models::articles::PSNotebookModel>> selectNotebooks() const;

    private:
        std::string baseUrl;
    };
}
