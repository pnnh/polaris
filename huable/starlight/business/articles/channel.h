#pragma once
#include <vector>

#include "calieo/telescope/models/articles/Channel.h"

namespace calieo::telescope
{
    bool isChannelDirectory(const std::string& directoryName);

    class ChannelServerBusiness
    {
    public:
        explicit ChannelServerBusiness(const std::string& baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<calieo::telescope::PSChannelModel>> selectChannels() const;

    private:
        std::string baseUrl;
    };

    class ChannelClientBusiness
    {
    public:
        ChannelClientBusiness();

        ~ChannelClientBusiness();

        std::shared_ptr<std::vector<calieo::telescope::PSChannelModel>> selectChannels();
    };
}

