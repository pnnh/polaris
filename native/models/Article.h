#pragma once

#include <string>
#include <chrono>

namespace polaris {
    class Article {
    public:
        Article(std::string title, std::string content);

        std::string getTitle();

        std::string getContent();

        std::string uid;
        long nid;
        std::string title;
        std::string header;
        std::string body;
        std::string keywords;
        std::string description;
        std::chrono::system_clock::time_point create_time;
        std::chrono::system_clock::time_point update_time;
    };
}
