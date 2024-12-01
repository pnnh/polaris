
#include "notebook.h"
#include "huable/starlight/business/articles/notebook.h"

#include <build.h>
#include <quantum/services/logger/logger.h>

#include "galaxy/quantum/services/filesystem/filesystem.h"


int huable::starlight::examples::articles::TestArticleSelectNotebooks()
{
    const std::string baseUrl = quantum::JoinFilePath({
        PROJECT_SOURCE_DIR, "assets", "data", "CPlus.notelibrary"
    });
    auto notebookServer = std::make_shared<huable::starlight::NotebookServerBusiness>(baseUrl);
    auto notebookPtr = notebookServer->selectNotebooks();
    for (const auto& model : *notebookPtr)
    {
        quantum::Logger::LogInfo({model.URN, model.Title, model.Title});
    }
    return 0;
}
