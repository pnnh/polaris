#include "native/utils/query.h"
#include <boost/range/algorithm.hpp>

QueryParam::QueryParam(const std::string &url_string)
    : parsed_url(boost::urls::parse_uri(std::string("http://localhost") +
                                        url_string)) {}

std::optional<std::string> QueryParam::getString(const std::string &key) {
  auto it =
      boost::range::find_if(parsed_url->params(), [key](boost::urls::param p) {
        return p.key == key;
      });

  if (it == parsed_url->params().end()) {
    return std::nullopt;
  }
  return (*it).value;
}

std::optional<long> QueryParam::getLong(const std::string &key) {
  auto it =
      boost::range::find_if(parsed_url->params(), [key](boost::urls::param p) {
        return p.key == key;
      });

  if (it == parsed_url->params().end()) {
    return std::nullopt;
  }
  return std::stol((*it).value);
}