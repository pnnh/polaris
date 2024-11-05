#include "appconfig.h"
#include <boost/algorithm/string/split.hpp>
#include <libenvpp/env.hpp>
#include <spdlog/spdlog.h>

AppConfig::AppConfig()
{
    env::prefix envPrefix("PL");
    auto dsnKey = envPrefix.register_required_variable<std::string>("DSN");
 
    parsedEnvPrefixPtr = std::make_shared<env::parsed_and_validated_prefix<env::prefix>>(envPrefix.parse_and_validate());
    if (parsedEnvPrefixPtr-> errors().size() > 0)
    {
        spdlog::error("Error parsing and validating environment variables: {}\n{}",
        parsedEnvPrefixPtr->error_message(), parsedEnvPrefixPtr->warning_message());
        exit(1);
    } 
    dnsValue = parsedEnvPrefixPtr -> get(dsnKey);
}

std::string AppConfig::GetDSN()
{ 
    return dnsValue;
}