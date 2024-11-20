#pragma once

#include <iostream>
#include <optional>
#include <boost/url/detail/config.hpp>
#include <boost/url/error_types.hpp>
#include <boost/url/url_view.hpp>

namespace server
{
    class QueryUtils
    {
    public:
        explicit QueryUtils(const char *baseUrl);
        explicit QueryUtils(const std::string &baseUrl);

        std::optional<std::string> GetString(const std::string key);
        std::optional<long> GetLong(const std::string key);

    private:
        std::string baseUrl;
        boost::system::result<boost::urls::url_view> urlView;
    };
}
