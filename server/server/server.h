//
// Created by azureuser on 4/10/23.
//

#ifndef PULSAR_SERVER_H
#define PULSAR_SERVER_H


#include <string>
#include <boost/asio.hpp>
#include "http_connection.h"
#include <boost/regex.hpp>
#include <functional>
#include <boost/beast/core.hpp>
#include <boost/beast/http.hpp>
#include <boost/asio.hpp>
#include <map>

typedef std::function<void(boost::beast::http::request<boost::beast::http::dynamic_body> &request,
                           boost::beast::http::response<boost::beast::http::dynamic_body> &response)> Handler;

using tcp = boost::asio::ip::tcp;

class PulsarServer {

public:
    PulsarServer();

    PulsarServer(std::string host, unsigned short port);

    void Start();

    void RegisterHandler(const std::string &path, Handler handler);

private:
    void Handle(tcp::acceptor &acceptor, tcp::socket &socket);

    void read_request(const std::shared_ptr<http_connection> &connection);

    void process_request(const std::shared_ptr<http_connection> &connection);

    void create_response(const std::shared_ptr<http_connection> &connection);

    static void write_response(const std::shared_ptr<http_connection> &connection);

    Handler FindHandler(const std::string &path);

    std::map<boost::regex, Handler> handlers;

    std::string host;
    unsigned short port;
};


#endif //PULSAR_SERVER_H
