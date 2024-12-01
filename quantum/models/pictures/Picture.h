#pragma once
#include <string>
#include <chrono>

namespace quantum
{
    class PSPictureModel
    {
    public:
        PSPictureModel();

        std::string URN;
        std::string Name;
        std::string Title;
        std::string Path;
        std::string Keywords;
        std::string Description;
        std::chrono::system_clock::time_point CreateTime;
        std::chrono::system_clock::time_point UpdateTime;
    };
}
