#pragma once
#include <string>
#include <chrono>

namespace native::models
{
    class PSFileModel
    {
    public:
        PSFileModel(std::string title);

        std::string URN;
        std::string Title;
        std::string Keywords;
        std::string Description;
        bool IsDir;
        std::chrono::system_clock::time_point CreateTime;
        std::chrono::system_clock::time_point UpdateTime;
    };
}
