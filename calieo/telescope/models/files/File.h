#pragma once
#include <string>
#include <chrono>
#include "quantum/types/datetime.h"

namespace polaris::native
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
        polaris::base::PSDatetime CreateTime;
        polaris::base::PSDatetime UpdateTime;
    };
}
