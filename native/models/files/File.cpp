
#include "File.h"

polaris::native::PSFileModel::PSFileModel(std::string title)
{
    this->Title = title;
    this->CreateTime = std::chrono::system_clock::now();
    this->UpdateTime = std::chrono::system_clock::now();
}
