
#include "notebook.h"
#include "native/business/articles/notebook.h"

#include "native/services/filesystem/filesystem.h"
#include "native/services/logger/logger.h"

namespace business = native::business;
namespace logger = native::services::logger;

int native::examples::articles::TestArticleSelectNotebooks()
{
    const std::string baseUrl = services::filesystem::JoinFilePath({"assets", "data", "CPlus.notelibrary"});
    auto notebookServer = std::make_shared<business::articles::NotebookServerBusiness>(baseUrl);
    auto notebookPtr = notebookServer->selectNotebooks();
    for (const auto& model : *notebookPtr)
    {
        logger::Logger::LogInfo({model.URN, model.Title, model.Title});
    }
    return 0;
}
