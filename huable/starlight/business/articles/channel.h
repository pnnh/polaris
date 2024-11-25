#pragma once
#include <vector>

#include "huable/starlight/models/articles/Channel.h"

namespace huable::starlight
{
    bool isChannelDirectory(const std::string& directoryName);

    class ChannelServerBusiness
    {
    public:
        explicit ChannelServerBusiness(const std::string& baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<huable::starlight::PSChannelModel>> selectChannels() const;

    private:
        std::string baseUrl;
    };

    class ChannelClientBusiness
    {
    public:
        ChannelClientBusiness();

        ~ChannelClientBusiness();

        std::shared_ptr<std::vector<huable::starlight::PSChannelModel>> selectChannels();
    };
}

