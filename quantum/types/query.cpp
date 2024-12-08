#include "query.h"

#include "Exception.h"
#include "String.h"
#include <boost/range/algorithm.hpp>

quantum::MTQueryString::MTQueryString(const std::string& url_string)
{
  auto fullUrl = std::string(url_string);
  if (!quantum::PSString::StartsWith(fullUrl, "http://") && !quantum::PSString::StartsWith(
    fullUrl, "https://"))
  {
    fullUrl = std::string("http://localhost") + fullUrl;
  }

  this->_fullUrl = fullUrl;
}

boost::urls::url_view parseUrl(const std::string& fullUrl)
{
  auto parseResult = boost::urls::parse_uri(fullUrl);
  if (parseResult.has_error())
  {
    throw quantum::PSException(quantum::QuantumEnum::ERROR,
                                     std::string("url parse error") + parseResult.error().to_string());
  }
  return parseResult.value();
}

std::optional<std::string> quantum::MTQueryString::getString(const std::string& name) const
{
  auto parsedUrl = parseUrl(this->_fullUrl);
  const auto it =
    boost::range::find_if(parsedUrl.params(), [name](const boost::urls::param& p)
    {
      return p.key == name;
    });

  if (it != parsedUrl.params().end())
  {
    return (*it).value;
  }
  return std::nullopt;
}

std::optional<long> quantum::MTQueryString::getLong(const std::string& key)
{
  auto parsedUrl = parseUrl(this->_fullUrl);
  auto it =
    boost::range::find_if(parsedUrl.params(), [key](boost::urls::param p)
    {
      return p.key == key;
    });

  if (it != parsedUrl.params().end())
  {
    return std::stol((*it).value);
  }
  return std::nullopt;
}
