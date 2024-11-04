#pragma once

#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <boost/asio.hpp>
#include <chrono>
#include <cstdlib>
#include <ctime>
#include <iostream>
#include <memory>

class MailController {
public:
    static void HandleGet(boost::beast::http::request<boost::beast::http::dynamic_body> &request,
                          boost::beast::http::response<boost::beast::http::dynamic_body> &response);

    static void HandleDelete(boost::beast::http::request<boost::beast::http::dynamic_body> &request,
                             boost::beast::http::response<boost::beast::http::dynamic_body> &response);

    static void HandleSelect(boost::beast::http::request<boost::beast::http::dynamic_body> &request,
                             boost::beast::http::response<boost::beast::http::dynamic_body> &response);

    static void HandleInsert(boost::beast::http::request<boost::beast::http::dynamic_body> &request,
                             boost::beast::http::response<boost::beast::http::dynamic_body> &response);

    static void HandleUpdate(boost::beast::http::request<boost::beast::http::dynamic_body> &request,
                             boost::beast::http::response<boost::beast::http::dynamic_body> &response);
};
