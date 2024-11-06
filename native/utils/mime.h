#pragma once

#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <string>

boost::beast::string_view mime_type(boost::beast::string_view path);

class MimeUtils {
public:
    static bool isHidden(const std::string &path);
    static bool isIgnore(const std::string &path);
};
