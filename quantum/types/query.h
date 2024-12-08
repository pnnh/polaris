#pragma once

#include <boost/url.hpp>
#include <optional>
#include <string>
#include <quantum/build.h>

#ifdef __cplusplus

namespace quantum
{
  class MTAPI_EXPORT MTQueryString
  {
  public:
    explicit MTQueryString(const std::string& url_string);

    [[nodiscard]] std::optional<std::string> getString(const std::string& key) const;
    std::optional<long> getLong(const std::string& key);

  private:
    std::string _fullUrl;
  };
}


extern "C" {
#endif


#ifdef __cplusplus
}
#endif
