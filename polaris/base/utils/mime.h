#pragma once

#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>

boost::beast::string_view mime_type(boost::beast::string_view path);
