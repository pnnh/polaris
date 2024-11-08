#pragma once

#include <string>
#include <chrono>

namespace polaris
{
    class Picture
    {
    public:
        Picture(std::string title, std::string content);
        std::string getTitle();
        std::string getContent();
        std::string uid;
        long nid;
        std::string title;
        std::string header;
        std::string body;
        std::string keywords;
        std::string description;

    private:
        std::string title;
        std::string content;
    };
}
