
#include "notebook.h"
#include "native/business/articles/notebook.h"

#include <build.h>

#include "base/services/filesystem/filesystem.h"
#include "base/services/logger/logger.h"

namespace business = native::business;
namespace logger = native::services::logger;

int native::examples::articles::TestArticleSelectNotebooks()
{
    const std::string baseUrl = services::filesystem::JoinFilePath({
        PROJECT_SOURCE_DIR, "assets", "data", "CPlus.notelibrary"
    });
    auto notebookServer = std::make_shared<business::articles::NotebookServerBusiness>(baseUrl);
    auto notebookPtr = notebookServer->selectNotebooks();
    for (const auto& model : *notebookPtr)
    {
        logger::Logger::LogInfo({model.URN, model.Title, model.Title});
    }
    return 0;
}
