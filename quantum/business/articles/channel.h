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

        [[nodiscard]] std::shared_ptr<std::vector<PSChannelModel>> selectChannels() const;

    private:
        std::string baseUrl;
    };
}

