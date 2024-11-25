
#include "notebook.h"
#include "calieo/telescope/business/articles/notebook.h"

#include <build.h>
#include <quantum/services/logger/logger.h>

#include "galaxy/quantum/services/filesystem/filesystem.h"


int calieo::telescope::examples::articles::TestArticleSelectNotebooks()
{
    const std::string baseUrl = quantum::JoinFilePath({
        PROJECT_SOURCE_DIR, "assets", "data", "CPlus.notelibrary"
    });
    auto notebookServer = std::make_shared<calieo::telescope::NotebookServerBusiness>(baseUrl);
    auto notebookPtr = notebookServer->selectNotebooks();
    for (const auto& model : *notebookPtr)
    {
        quantum::Logger::LogInfo({model.URN, model.Title, model.Title});
    }
    return 0;
}
