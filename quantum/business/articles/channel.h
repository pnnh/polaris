#pragma once
#include <vector>

#include "quantum/models/articles/Channel.h"

namespace quantum
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

