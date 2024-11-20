#include "query.h"
#include <string>
#include <filesystem>
#include <boost/range/algorithm.hpp>
#include <boost/url.hpp>
#include <boost/uuid/uuid_io.hpp>
#include "native/models/protocol/Exception.h"
#include "native/services/filesystem/filesystem.h"
#include "native/services/sqlite/SqliteService.h"
#include "native/services/logger/logger.h"
#include "native/services/yaml/yaml.h"
#include "native/utils/md5.h"
#include "native/utils/StringUtils.h"

server::QueryUtils::QueryUtils(const char *baseUrl) : QueryUtils(std::string(baseUrl))
{
}

server::QueryUtils::QueryUtils(const std::string &baseUrl)
{
    this->baseUrl = baseUrl;
    auto fullUrl = std::string(baseUrl);
    if (!native::StringUtils::StartsWith(baseUrl, "http://") && !native::StringUtils::StartsWith(baseUrl, "https://"))
    {
        fullUrl = std::string("http://localhost") + fullUrl;
    }

    auto url = boost::urls::parse_uri(fullUrl);
    if (url.has_error())
    {
        auto exception = models::protocol::QuantumException(models::protocol::QuantumError::ERROR, "url parse error");
        exception.AppendMessage(url.error().message());
        throw exception;
    }
    this->urlView = url.value();
}

std::optional<std::string> server::QueryUtils::GetString(const std::string key)
{
    auto it = boost::range::find_if(
        this->urlView->params(), [key](boost::urls::param p)
        { return p.key == key; });

    std::string stringValue;
    if (it != this->urlView->params().end())
    {
        stringValue = (*it).value;
        return std::make_optional(stringValue);
    }

    return std::nullopt;
}

std::optional<long> server::QueryUtils::GetLong(const std::string key)
{
    auto strValue = this->GetString(key);
    if (!strValue.has_value() || strValue.value().empty())
    {
        return std::nullopt;
    }
    return std::stol(strValue.value());
}