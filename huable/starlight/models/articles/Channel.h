
#include <string>
#include <chrono>

namespace calieo::telescope
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
        std::string Image;
        std::chrono::system_clock::time_point CreateTime;
        std::chrono::system_clock::time_point UpdateTime;
    };
}
