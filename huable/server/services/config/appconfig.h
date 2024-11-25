#pragma once

#include <memory>
#include <string>
#include <libenvpp/env.hpp>

namespace huable::server
{
    class AppConfig
    {
    public:
        static AppConfig& Default()
        {
            static AppConfig instance;
            return instance;
        }

        AppConfig();

        std::string GetDSN();

    private:
        std::shared_ptr<env::parsed_and_validated_prefix<env::prefix>> parsedEnvPrefixPtr;
        std::string dnsValue;
    };
}
