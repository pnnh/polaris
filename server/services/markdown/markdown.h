#pragma once

#include <boost/asio.hpp>
#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <chrono>
#include <cstdlib>
#include <ctime>
#include <iostream>
#include <memory>

void HandleMarkdown(
    boost::beast::http::response<boost::beast::http::dynamic_body> &response);
void HandleMarkdown2(
    boost::beast::http::request<boost::beast::http::dynamic_body> &request,
    boost::beast::http::response<boost::beast::http::dynamic_body> &response);

