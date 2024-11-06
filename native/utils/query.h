#pragma once

#include <boost/url.hpp>
#include <optional>
#include <string>

class QueryParam {
public:
  QueryParam(const std::string &url_string);

  std::optional<std::string> getString(const std::string &key);
  std::optional<long> getLong(const std::string &key);

private:
  boost::system::result<boost::urls::url_view> parsed_url;
};