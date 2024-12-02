#include "pulsar/controllers/index.h"
#include <boost/uuid/uuid_io.hpp>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>
#include <workflow/HttpMessage.h>

using json = nlohmann::json;

void pulsar::HandleIndex(WFHttpTask* httpTask)
{
    protocol::HttpResponse* response = httpTask->get_resp();

    response->set_http_version("HTTP/1.1");
    response->add_header_pair("Content-Type", "application/json; charset=utf-8");
    response->add_header_pair("Access-Control-Allow-Origin", "*");
    response->add_header_pair("Server", "Sogou WFHttpServer");

    json data = json::object({
        {"code", 200},
        {"message", "Hello, World!"},
    });

    std::ostringstream oss;
    oss << data;

    auto bodyStr = oss.str();
    auto bodySize = bodyStr.size();

    response->append_output_body(bodyStr.c_str(), bodySize);

    response->set_status_code("200");
}
