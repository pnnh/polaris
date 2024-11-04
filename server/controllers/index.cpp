//
// Created by ubuntu on 12/25/21.
//

#include "server/controllers/index.h"
#include <fstream>
#include "common/utils/mime.h"

void HandleIndex(boost::beast::http::response<boost::beast::http::dynamic_body> &response_) {
    response_.result(boost::beast::http::status::ok);
    response_.keep_alive(false);
    response_.set(boost::beast::http::field::server, "Beast");

    //boost::beast::ostream(response_.body()) << "Hello World";


    //response_.set(boost::beast::http::field::content_type, "text/html");
    std::ifstream infile;
    infile.open("assets/index.html");

    std::string path = "assets/index.html";

    std::string full_path = "assets/index.html";

    response_.result(boost::beast::http::status::ok);
    response_.keep_alive(false);
    response_.set(boost::beast::http::field::server, "Beast");
    response_.set(boost::beast::http::field::content_type, mime_type(std::string(full_path)));

    boost::beast::ostream(response_.body()) << infile.rdbuf();
}