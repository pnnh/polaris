#pragma once

#include <string>

namespace polaris {
    class Article {
    public:
        Article(std::string title, std::string content);
        std::string getTitle();
        std::string getContent();
    private:
        std::string title;
        std::string content;
    };
}
