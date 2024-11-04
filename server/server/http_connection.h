#pragma once

#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <boost/asio.hpp>
#include <chrono>
#include <cstdlib>
#include <ctime>
#include <iostream>
#include <memory>

class http_connection : public std::enable_shared_from_this<http_connection> {
public:
    explicit http_connection(boost::asio::ip::tcp::socket socket)
            : socket_(std::move(socket)) {
    }

    // Initiate the asynchronous operations associated with the connection.
    void start() {
        read_request();
        check_deadline();
    }

private:
    boost::asio::ip::tcp::socket socket_;

    boost::beast::flat_buffer buffer_{8192};

    boost::beast::http::request<boost::beast::http::dynamic_body> request_;

    boost::beast::http::response<boost::beast::http::dynamic_body> response_;
//
//    boost::optional<boost::beast::http::response<boost::beast::http::file_body>> file_response_;
//
//    boost::optional<boost::beast::http::response_serializer<boost::beast::http::file_body>> file_serializer_;

    boost::asio::steady_timer deadline_{
            socket_.get_executor(), std::chrono::seconds(60)};

    void read_request();

    void process_request();

    void create_response();

    void write_response();

    void send_file();

    void check_deadline();
};
