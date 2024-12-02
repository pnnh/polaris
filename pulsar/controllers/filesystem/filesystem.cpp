#include "pulsar/controllers/filesystem/filesystem.h"
#include <boost/range/algorithm.hpp>
#include <boost/url.hpp>
#include <boost/uuid/uuid_io.hpp>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>
#include "build.h"
#include <workflow/HttpMessage.h>
#include "quantum/business/filesystem/file.h"
#include "quantum/services/filesystem/filesystem.h"
#include <iostream>
#include "quantum/types/String.h"
#include "quantum/utils/basex.h"
#include "quantum/utils/query.h"


using json = nlohmann::json;

void pulsar::HandleFileList(WFHttpTask* httpTask)
{
    protocol::HttpRequest* request = httpTask->get_req();
    protocol::HttpResponse* response = httpTask->get_resp();

    response->set_http_version("HTTP/1.1");
    response->add_header_pair("Content-Type", "application/json; charset=utf-8");
    response->add_header_pair("Access-Control-Allow-Origin", "*");

    auto request_uri = request->get_request_uri();

    quantum::QueryParam queryParam{std::string(request_uri)};

    auto homeDirectory = quantum::UserHomeDirectory();
    auto baseUrl = homeDirectory;
    auto encodePath = queryParam.getString("path");
    if (encodePath.has_value() && !encodePath.value().empty())
    {
        auto decodePath = quantum::decode64(encodePath.value());
        baseUrl = quantum::PSString::LeftReplace(decodePath, "~", homeDirectory);
    }

    std::ostringstream oss;
    auto fileServer = std::make_shared<quantum::FileServerBusiness>(baseUrl);
    auto filesPtr = fileServer->selectFiles();
    json range = json::array();
    for (const auto& model : *filesPtr)
    {
        json item = {
            {"URN", model.URN},
            {"Title", model.Title},
            {"Name", model.Name},
            {"Description", model.Description},
            {"IsDir", model.IsDir},
            {"IsHidden", model.IsHidden},
            {"IsIgnore", model.IsIgnore},
            {"CreateTime", model.CreateTime.toString()},
            {"UpdateTime", model.UpdateTime.toString()},
        };
        range.push_back(item);
    }

    auto count = filesPtr->size();
    json data = json::object({
        {"code", 200},
        {"message", "Hello, World!"},
        {
            "data", {
                {"count", count},
                {
                    "range",
                    range,
                }
            }
        },
    });
    oss << data;

    auto bodyStr = oss.str();
    auto bodySize = bodyStr.size();

    response->append_output_body(bodyStr
                                 .c_str(), bodySize);

    response->set_status_code(
        "200"
    );
}
