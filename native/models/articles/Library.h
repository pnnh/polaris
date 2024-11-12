#pragma once

#include <string>
#include <chrono>

namespace native::models::articles
{
    class PSLibraryModel
    {
    public:
        PSLibraryModel();
        explicit PSLibraryModel(const std::string& name);

        std::string URN;
        std::string Title;
        std::string Keywords;
        std::string Description;
        std::string Image;
        std::chrono::system_clock::time_point CreateTime;
        std::chrono::system_clock::time_point UpdateTime;
    };
}
