#pragma once

#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <boost/asio.hpp>
#include <chrono>
#include <cstdlib>
#include <ctime>
#include <iostream>
#include <memory>

void HandleIndex(boost::beast::http::response<boost::beast::http::dynamic_body> &response);
 
