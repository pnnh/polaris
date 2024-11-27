#include "huable/server/controllers/article.h"
#include <boost/range/algorithm.hpp>
#include <boost/url.hpp>
#include <boost/uuid/uuid_io.hpp>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>
#include <workflow/HttpMessage.h>

#include "galaxy/quantum/utils/query.h"

#include "huable/starlight/business/articles/article.h"

#include <build.h>
#include <galaxy/quantum/types/String.h>
#include <galaxy/quantum/utils/basex.h>

#include "galaxy/quantum/services/filesystem/filesystem.h"
#include "galaxy/quantum/services/logger/logger.h"

using json = nlohmann::json;

void huable::server::HandleArticleGet(WFHttpTask* httpTask)
{
    protocol::HttpRequest* request = httpTask->get_req();
    protocol::HttpResponse* response = httpTask->get_resp();

    response->set_http_version("HTTP/1.1");
    response->add_header_pair("Content-Type", "application/json; charset=utf-8");
    response->add_header_pair("Access-Control-Allow-Origin", "*");

    auto request_uri = request->get_request_uri();

    quantum::QueryParam queryParam{std::string(request_uri)};

    auto noteURN = queryParam.getString("note");
    if (!noteURN.has_value())
    {
        response->set_status_code("400");
        return;
    }

    std::ostringstream oss;
    auto database_path = quantum::JoinFilePath({PROJECT_BINARY_DIR, "polaris.sqlite"});

    auto articleServer = std::make_shared<huable::starlight::ArticleSqliteService>(database_path);
    auto model = articleServer->getArticle(noteURN.value());
    if (model == nullptr)
    {
        response->set_status_code("404");
        return;
    }
    json data = json::object({
        {"code", 200},
        {"message", "Hello, World!"},
        {
            "data", json::object({
                {"uid", model->URN},
                {"title", model->Title},
                {"header", model->Header},
                {"body", model->Body},
                {"keywords", model->Keywords},
                {"description", model->Description},
                {"create_time", model->CreateTime.toString()},
                {"update_time", model->UpdateTime.toString()},
            })
        },
    });

    oss << data;

    auto bodyStr = oss.str();
    auto bodySize = bodyStr.size();

    response->append_output_body(bodyStr.c_str(), bodySize);

    response->set_status_code("200");
}

void huable::server::HandleArticles(WFHttpTask* httpTask)
{
    protocol::HttpRequest* request = httpTask->get_req();
    protocol::HttpResponse* response = httpTask->get_resp();

    response->set_http_version("HTTP/1.1");
    response->add_header_pair("Content-Type", "application/json; charset=utf-8");
    response->add_header_pair("Access-Control-Allow-Origin", "*");

    auto request_uri = request->get_request_uri();

    quantum::QueryParam queryParam{std::string(request_uri)};

    auto chanURN = queryParam.getString("chan");
    if (!chanURN.has_value())
    {
        response->set_status_code("400");
        return;
    }

    std::ostringstream oss;
    //const std::string baseUrl = quantum::JoinFilePath({PROJECT_SOURCE_DIR, "huable", "tests", "data"});

    auto database_path = quantum::JoinFilePath({PROJECT_BINARY_DIR, "polaris.sqlite"});
    auto articleServer = std::make_shared<starlight::ArticleSqliteService>(database_path);
    auto articlePtr = articleServer->selectArticles(chanURN.value());
    json range = json::array();
    for (const auto& model : *articlePtr)
    {
        quantum::Logger::LogInfo({model.URN, model.Title, model.Title});
        json item = {
            {"urn", model.URN},
            {"title", model.Title},
            {"header", model.Header},
            {"body", model.Body},
            {"description", model.Description},
        };
        range.push_back(item);
    }
    auto count = articlePtr->size();

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

    response->append_output_body(bodyStr.c_str(), bodySize);

    response->set_status_code("200");
}

// void
// MessageController::HandleDelete(boost::beast::http::request<boost::beast::http::dynamic_body>
// &request,
//                                      boost::beast::http::response<boost::beast::http::dynamic_body>
//                                      &response) {
//     response.result(boost::beast::http::status::ok);
//     response.keep_alive(false);
//     response.set(boost::beast::http::field::server, "Beast");

//     auto fullUrl = "http://localhost" + std::string(request.target());
//     auto url = boost::urls::parse_uri(fullUrl);
//     if (url.has_error()) {
//         spdlog::error("url parse error: {}", url.error().message());
//         response.result(boost::beast::http::status::internal_server_error);
//         return;
//     }

//     std::string msgPk = "";
//     for (auto p: url->params()) {
//         if (p.key == "pk") {
//             msgPk = p.value;
//         }
//     }
//     if (msgPk.empty()) {
//         spdlog::error("pk is empty");
//         response.result(boost::beast::http::status::bad_request);
//         return;
//     }

//     auto result = MessageService().deleteMessage(msgPk);
//     if (result != 0) {
//         response.result(boost::beast::http::status::internal_server_error);
//         return;
//     }

//     json data = {
//             {"code", Codes::Ok},
//     };

//     boost::beast::ostream(response.body()) << data;
// }

// void
// MessageController::HandleInsert(boost::beast::http::request<boost::beast::http::dynamic_body>
// &request,
//                                      boost::beast::http::response<boost::beast::http::dynamic_body>
//                                      &response) {

//     auto fullUrl = "http://localhost" + std::string(request.target());
//     auto url = boost::urls::parse_uri(fullUrl);
//     if (url.has_error()) {
//         spdlog::error("url parse error: {}", url.error().message());
//         response.result(boost::beast::http::status::internal_server_error);
//         return;
//     }

//     std::string title;
//     for (auto p: url->params()) {
//         if (p.key == "title") {
//             title = p.value;
//         }
//     }
//     if (title.empty()) {
//         spdlog::error("title is empty");
//         response.result(boost::beast::http::status::bad_request);
//         return;
//     }
//     boost::uuids::uuid a_uuid = boost::uuids::random_generator()(); //
//     这里是两个() ，因为这里是调用的 () 的运算符重载 const std::string pk =
//     boost::uuids::to_string(a_uuid);

//     auto model = ArticleModel{
//             .pk = pk,
//             .title = title,
//             .content = "content",
//             .create_time = std::chrono::system_clock::now(),
//             .update_time = std::chrono::system_clock::now(),
//             .creator = "creator",
//             .sender = "sender",
//             .receiver = "receiver",
//     };

//     auto result = MessageService().insertMessage(model);
//     if (result != 0) {
//         response.result(boost::beast::http::status::internal_server_error);
//         return;
//     }

//     json data = {
//             {"code", Codes::Ok},
//     };
//     boost::beast::ostream(response.body()) << data;

// }

// void
// MessageController::HandleUpdate(boost::beast::http::request<boost::beast::http::dynamic_body>
// &request,
//                                      boost::beast::http::response<boost::beast::http::dynamic_body>
//                                      &response) {
//     response.result(boost::beast::http::status::ok);
//     response.keep_alive(false);
//     response.set(boost::beast::http::field::server, "Beast");
// }
