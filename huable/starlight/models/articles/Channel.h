
#include <string>
#include <chrono>
#include <galaxy/quantum/types/datetime.h>

namespace huable::starlight
{
    class PSChannelModel
    {
    public:
        explicit PSChannelModel();
        explicit PSChannelModel(const std::string& name);

        std::string URN;
        std::string Name;
        std::string Title;
        std::string Keywords;
        std::string Description;
        std::string Image;
        std::string Path;
        quantum::PSDatetime CreateTime;
        quantum::PSDatetime UpdateTime;
    };
}
