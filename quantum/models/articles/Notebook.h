#pragma once

#include <string>
#include <chrono>

namespace quantum
{
    class PSNotebookModel
    {
    public:
        PSNotebookModel();
        explicit PSNotebookModel(const std::string& name);

        std::string URN;
        std::string Title;
        std::string Keywords;
        std::string Description;
        std::string Image;
        std::string Name;
        std::string Path;
        std::chrono::system_clock::time_point CreateTime;
        std::chrono::system_clock::time_point UpdateTime;
    };
}
