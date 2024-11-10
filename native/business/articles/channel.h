#pragma once
#include <vector>

#include "native/models/articles/Channel.h"

namespace polaris::native::business::ChannelBusiness {
    class ChannelServerBusiness {
    public:
        ChannelServerBusiness();

        ~ChannelServerBusiness();

        std::shared_ptr<std::vector<models::articles::PSChannelModel> > selectChannels();

    private:
        std::string baseUrl;
    };

    class ChannelClientBusiness {
    public:
        ChannelClientBusiness();

        ~ChannelClientBusiness();

        std::shared_ptr<std::vector<models::articles::PSChannelModel> > selectChannels();
    };
}

