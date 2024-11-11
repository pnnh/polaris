#pragma once
#include <vector>

#include "native/models/articles/Channel.h"

namespace native::business::articles
{
    bool isChannelDirectory(const std::string& directoryName);

    class ChannelServerBusiness
    {
    public:
        explicit ChannelServerBusiness(const std::string& baseUrl);

        [[nodiscard]] std::shared_ptr<std::vector<models::articles::PSChannelModel>> selectChannels() const;

    private:
        std::string baseUrl;
    };

    class ChannelClientBusiness
    {
    public:
        ChannelClientBusiness();

        ~ChannelClientBusiness();

        std::shared_ptr<std::vector<models::articles::PSChannelModel>> selectChannels();
    };
}

