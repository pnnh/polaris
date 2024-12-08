#include "pch.h"
#include "Filesystem.h"

#include <quantum/business/filesystem/file.h>

#include "quantum/services/filesystem/filesystem.h"


Gliese::GSFileModel::GSFileModel()
{
}

Gliese::GSFileModel::GSFileModel(const GSFileModel% other)
{
    this->URN = other.URN;
    this->Name = other.Name;
}

List<Gliese::GSFileModel^>^ Gliese::GSFilesystemService::selectFiles()
{
    auto resolvePath = std::string("C:\\Projects\\Multiverse\\assets\\data");
    auto fileServer = std::make_shared<quantum::FileServerBusiness>(resolvePath);
    auto filesPtr = fileServer->selectFiles();

    List<GSFileModel^>^ modelsList = gcnew List<GSFileModel^>(1);
    for (const auto& model : *filesPtr)
    {
        auto gsModel = gcnew GSFileModel();
        gsModel->URN = gcnew String(model.URN.c_str());
        gsModel->Name = gcnew String(model.Name.c_str());
        modelsList->Add(gsModel);
    }
    return modelsList;
}


