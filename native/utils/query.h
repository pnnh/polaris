#pragma once

#include <boost/url.hpp>
#include <optional>
#include <string>

class QueryParam
{
public:
  explicit QueryParam(const std::string& url_string);

  std::optional<std::string> getString(const std::string& key) const;
  std::optional<long> getLong(const std::string& key);

private:
  std::string _fullUrl;
};
