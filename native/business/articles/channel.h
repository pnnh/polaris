#pragma once
#include <vector>

#include "native/models/articles/Channel.h"

namespace polaris::native
{
    bool isChannelDirectory(const std::string& directoryName);

    class ChannelServerBusiness
    {
    public:
        explicit ChannelServerBusiness(const std::string& baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<polaris::native::PSChannelModel>> selectChannels() const;

    private:
        std::string baseUrl;
    };

    class ChannelClientBusiness
    {
    public:
        ChannelClientBusiness();

        ~ChannelClientBusiness();

        std::shared_ptr<std::vector<polaris::native::PSChannelModel>> selectChannels();
    };
}

