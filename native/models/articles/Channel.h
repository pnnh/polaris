
#include <string>
#include <chrono>

namespace native::models::articles
{
    class PSChannelModel
    {
    public:
        explicit PSChannelModel();
        explicit PSChannelModel(const std::string&& name);

        std::string URN;
        std::string Name;
        std::string Title;
        std::string Keywords;
        std::string Description;
        std::chrono::system_clock::time_point CreateTime;
        std::chrono::system_clock::time_point UpdateTime;
    };
}
