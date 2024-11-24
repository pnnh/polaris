#pragma once
#include <string>
#include <chrono>
#include "quantum/types/datetime.h"

namespace calieo::telescope
{
    class PSFileModel
    {
    public:
        explicit PSFileModel(std::string title);

        std::string URN;
        std::string Title;
        std::string Name;
        std::string Keywords;
        std::string Description;
        bool IsDir{};
        bool IsHidden{};
        bool IsIgnore{};
        quantum::PSDatetime CreateTime;
        quantum::PSDatetime UpdateTime;
    };
}
