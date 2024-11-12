#pragma once

#include <string>
#include <chrono>

namespace native::models::articles
{
    class PSArticleModel
    {
    public:
        PSArticleModel();
        explicit PSArticleModel(const std::string& title);

        std::string URN;
        std::string Title;
        std::string Header;
        std::string Body;
        std::string Keywords;
        std::string Description;
        std::string Image;
        std::chrono::system_clock::time_point CreateTime;
        std::chrono::system_clock::time_point UpdateTime;
    };
}
