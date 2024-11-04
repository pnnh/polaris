//
// Created by azureuser on 4/10/23.
//

#include "server.h"
#include "server/controllers/index.h"
#include "server/server/http_connection.h"
#include "common/utils/md5.h"
#include "server/services/markdown/markdown.h"
#include "common/utils/mime.h"
#include <boost/asio.hpp>
#include <boost/beast/http.hpp>
#include <folly/Uri.h>
#include <memory>
#include <spdlog/spdlog.h>
#include <utility>

namespace beast = boost::beast;
namespace http = beast::http;
namespace net = boost::asio;
using tcp = boost::asio::ip::tcp;

void PulsarServer::Handle(tcp::acceptor &acceptor, tcp::socket &socket) {
  acceptor.async_accept(socket, [&](beast::error_code ec) {
    if (!ec) {
      auto connection = std::make_shared<http_connection>(std::move(socket));
      this->read_request(connection);
    }

    this->Handle(acceptor, socket);
  });
}

PulsarServer::PulsarServer() : host("0.0.0.0"), port(8401) {}

PulsarServer::PulsarServer(std::string host, unsigned short port) {
  this->host = std::move(host);
  this->port = port;
}

void PulsarServer::Start() {
  auto const address = net::ip::make_address(this->host);

  net::io_context ioc{1};

  tcp::acceptor acceptor{ioc, {address, port}};
  tcp::socket socket{ioc};

  this->Handle(acceptor, socket);

  ioc.run();
}

void PulsarServer::read_request(
    const std::shared_ptr<http_connection> &connection) {

  boost::beast::http::async_read(
      connection->socket_, connection->buffer_, connection->request_,
      [connection, this](boost::beast::error_code ec,
                         std::size_t bytes_transferred) {
        boost::ignore_unused(bytes_transferred);
        if (!ec)
          process_request(connection);
      });
}

void PulsarServer::process_request(
    const std::shared_ptr<http_connection> &connection) {
  connection->response_.version(connection->request_.version());
  connection->response_.keep_alive(false);

  switch (connection->request_.method()) {
  case boost::beast::http::verb::get:
    connection->response_.result(boost::beast::http::status::ok);
    connection->response_.set(boost::beast::http::field::server, "Beast");
    create_response(connection);
    break;

  default:
    connection->response_.result(boost::beast::http::status::bad_request);
    connection->response_.set(boost::beast::http::field::content_type,
                              "text/plain");
    boost::beast::ostream(connection->response_.body())
        << "Invalid request-method '"
        << std::string(connection->request_.method_string()) << "'";
    break;
  }
}

void PulsarServer::create_response(
    const std::shared_ptr<http_connection> &connection) {
  auto isMd5 = connection->request_.target().find("/md5", 0);
  auto url = "http://localhost" + std::string(connection->request_.target());
  auto isArticle =
      connection->request_.target().find("/blog/articles/", 0) == 0;

  folly::Uri uri(url);
  const auto authority =
      fmt::format("The authority from {} is {}", uri.fbstr(), uri.authority());

  auto queryParams = uri.getQueryParams();

  std::string queryContent;
  for (auto &queryParam : queryParams) {
    if (queryParam.first == "c") {
      queryContent = queryParam.second;
    }
  }

  if (isMd5 == 0) {
    connection->response_.set(boost::beast::http::field::content_type,
                              "text/plain");
    std::string s = queryContent;

    md5 hash;
    md5::digest_type digest;

    hash.process_bytes(s.data(), s.size());
    hash.get_digest(digest);

    boost::beast::ostream(connection->response_.body())
        << "md5(" << s << ") = " << toString(digest) << '\n';
  } else if (uri.path() == "/markdown") {
    // HandleMarkdown(response_);
  } else if (isArticle) {
    HandleMarkdown2(connection->request_, connection->response_);
  } else if (uri.path() == "/") {
    HandleIndex(connection->response_);
    // send_file();
  } else {
    auto handler = this->FindHandler(uri.path());
    if (handler != nullptr) {
      try {
        handler(connection->request_, connection->response_);
      } catch (std::exception &e) {
        spdlog::error("[{}] {}", connection->request_.target(), e.what());
        connection->response_.result(
            boost::beast::http::status::internal_server_error);
      }
    } else {
      connection->response_.result(boost::beast::http::status::not_found);
      connection->response_.set(boost::beast::http::field::content_type,
                                "text/plain");
      boost::beast::ostream(connection->response_.body())
          << "File not found\r\n";
    }
  }
  write_response(connection);
}

void PulsarServer::write_response(
    const std::shared_ptr<http_connection> &connection) {

  connection->response_.content_length(connection->response_.body().size());

  boost::beast::http::async_write(
      connection->socket_, connection->response_,
      [connection](boost::beast::error_code ec, std::size_t) {
        connection->socket_.shutdown(
            boost::asio::ip::tcp::socket::shutdown_send, ec);
        connection->deadline_.cancel();
      });
}

void PulsarServer::RegisterHandler(const std::string &path, Handler handler) {
  handlers[boost::regex(path)] = std::move(handler);
}

Handler PulsarServer::FindHandler(const std::string &path) {
  for (auto &handler : handlers) {
    if (boost::regex_match(path, handler.first)) {
      return handler.second;
    }
  }
  return nullptr;
}