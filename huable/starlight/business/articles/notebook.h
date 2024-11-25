#pragma once

#include <vector>
#include "huable/starlight/models/articles/Notebook.h"

namespace huable::starlight
{
    bool isNotebookDirectory(const std::string& directoryName);

    class NotebookServerBusiness
    {
    public:
        explicit NotebookServerBusiness(const std::string& baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<huable::starlight::PSNotebookModel>> selectNotebooks() const;

    private:
        std::string baseUrl;
    };
}
