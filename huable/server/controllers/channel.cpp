#include "huable/server/controllers/channel.h"
#include <boost/range/algorithm.hpp>
#include <boost/url.hpp>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>
#include "build.h"
#include <workflow/HttpMessage.h>
#include "huable/starlight/business/articles/channel.h"
#include "quantum/services/filesystem/filesystem.h"
#include "quantum/services/logger/logger.h"

using json = nlohmann::json;

void polaris::server::HandleChannels(WFHttpTask* httpTask)
{
    protocol::HttpRequest* request = httpTask->get_req();
    protocol::HttpResponse* response = httpTask->get_resp();

    response->set_http_version("HTTP/1.1");
    response->add_header_pair("Content-Type", "application/json; charset=utf-8");
    response->add_header_pair("Access-Control-Allow-Origin", "*");
    response->add_header_pair("Server", "Sogou WFHttpServer");

    auto request_uri = request->get_request_uri();

    auto fullUrl = std::string("http://localhost") + request_uri;

    auto url = boost::urls::parse_uri(fullUrl);
    if (url.has_error())
    {
        spdlog::error("url parse error: {}", url.error().message());
        response->set_status_code("500");
        return;
    }

    auto it = boost::range::find_if(
        url->params(), [](boost::urls::param p)
        {
            return p.key == "limit";
        });

    int limit = 10;
    std::string limitString;
    if (it != url->params().end())
    {
        limitString = (*it).value;
    }
    if (!limitString.empty())
    {
        limit = std::stoi(limitString);
    }

    std::ostringstream oss;
    const std::string baseUrl = quantum::JoinFilePath({PROJECT_SOURCE_DIR, "assets", "data"});
    auto channelServer = std::make_shared<huable::starlight::ChannelServerBusiness>(baseUrl);
    auto channelsPtr = channelServer->selectChannels();
    json range = json::array();
    for (const auto& model : *channelsPtr)
    {
        quantum::Logger::LogInfo({model.URN, model.Name, model.Title});

        json item = {
            {"urn", model.URN},
            {"title", model.Title},
            {"name", model.Name},
            {"description", model.Description},
        };
        range.push_back(item);
    }

    auto count = channelsPtr->size();
    json data = json::object({
        {"count", count},
        {
            "range",
            range,
        }
    });
    oss << data;

    auto bodyStr = oss.str();
    auto bodySize = bodyStr.size();

    response->append_output_body(bodyStr.c_str(), bodySize);

    response->set_status_code("200");
}
