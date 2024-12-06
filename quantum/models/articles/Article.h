#pragma once

#include <string>
#include <chrono>
#include <quantum/types/datetime.h>

namespace quantum
{
    class PSArticleModel
    {
    public:
        PSArticleModel();
        explicit PSArticleModel(const std::string& title);

        PSArticleModel(const PSArticleModel& other);

        std::string URN;
        std::string Title;
        std::string Header;
        std::string Body;
        std::string Keywords;
        std::string Description;
        std::string Path;
        std::string Channel;
        std::string Cover;
        quantum::PSDatetime CreateTime;
        quantum::PSDatetime UpdateTime;
    };
}
