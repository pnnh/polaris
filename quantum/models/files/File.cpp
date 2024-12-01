
#include "File.h"

quantum::PSFileModel::PSFileModel(std::string title)
{
    this->Title = title;
    this->CreateTime = std::chrono::system_clock::now();
    this->UpdateTime = std::chrono::system_clock::now();
}
