
#include <string>
#include <chrono>

namespace native::models::pictures {
    class PSPictureModel {
    public:
        PSPictureModel(std::string title, std::string content);

        std::string getTitle();

        std::string getContent();

        std::string uid;
        long nid;
        std::string title;
        std::string keywords;
        std::string description;
        std::chrono::system_clock::time_point create_time;
        std::chrono::system_clock::time_point update_time;
    };
}
