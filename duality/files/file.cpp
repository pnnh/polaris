
#include "file.h"
#include "quantum/business/filesystem/file.h"

#include "quantum/build.h"
#include "quantum/services/filesystem/filesystem.h"

int quantum::examples::TestSelectFiles()
{
    const std::string baseUrl = quantum::JoinFilePath({PROJECT_SOURCE_DIR, "calieo", "telescope", "tests", "data"});
    auto fileServer = std::make_shared<quantum::FileServerBusiness>(baseUrl);
    auto filesPtr = fileServer->selectFiles();
    for (const auto& model : *filesPtr)
    {
        //quantum::Logger::LogInfo({model.URN, model.Title});
    }
    auto filesPtr2 = fileServer->selectFiles("CPlus.chan/assets");
    auto size = filesPtr2->size();
    for (const auto& model : *filesPtr2)
    {
        //quantum::Logger::LogInfo({model.URN, model.Title});
    }
    return 0;
}
