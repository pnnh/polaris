#include "server/controllers/filesystem/filesystem.h"
#include <boost/range/algorithm.hpp>
#include <boost/url.hpp>
#include <boost/uuid/uuid_io.hpp>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>
#include "build.h"
#include <workflow/HttpMessage.h>
#include "native/business/filesystem/file.h"
#include "base/services/filesystem/filesystem.h"
#include <iostream>
#include <base/utils/basex.h>
#include <base/utils/query.h>


using json = nlohmann::json;

void polaris::server::HandleFileList(WFHttpTask* httpTask)
{
    protocol::HttpRequest* request = httpTask->get_req();
    protocol::HttpResponse* response = httpTask->get_resp();

    response->set_http_version("HTTP/1.1");
    response->add_header_pair("Content-Type", "application/json; charset=utf-8");
    response->add_header_pair("Access-Control-Allow-Origin", "*");

    auto request_uri = request->get_request_uri();

    polaris::base::QueryParam queryParam{std::string(request_uri)};

    auto encodePath = queryParam.getString("path");
    if (!encodePath.has_value())
    {
        response->set_status_code("500");
        return;
    }
    auto decodePath = polaris::base::decode64(encodePath.value());

    std::ostringstream oss;
    const std::string baseUrl = decodePath;
    //native::services::filesystem::JoinFilePath({PROJECT_SOURCE_DIR, "assets", "data"});
    auto fileServer = std::make_shared<polaris::native::FileServerBusiness>(baseUrl);
    auto filesPtr = fileServer->selectFiles();
    json range = json::array();
    for (const auto& model : *filesPtr)
    {
        json item = {
            {"urn", model.URN},
            {"title", model.Title},
            {"name", model.Name},
            {"description", model.Description},
        };
        range.push_back(item);
    }

    auto count = filesPtr->size();
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
