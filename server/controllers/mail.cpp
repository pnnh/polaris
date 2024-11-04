#include "server/controllers/mail.h"
#include "server/models/codes.h"
#include "server/services/business/mail.h"
#include <boost/range/algorithm.hpp>
#include <boost/url.hpp>
#include <boost/uuid/uuid.hpp>
#include <boost/uuid/uuid_generators.hpp>
#include <boost/uuid/uuid_io.hpp>
#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using json = nlohmann::json;

void MailController::HandleGet(boost::beast::http::request<boost::beast::http::dynamic_body> &request,
                               boost::beast::http::response<boost::beast::http::dynamic_body> &response) {

    auto fullUrl = "http://localhost" + std::string(request.target());

    auto url = boost::urls::parse_uri(fullUrl);
    if (url.has_error()) {
        spdlog::error("url parse error: {}", url.error().message());
        response.result(boost::beast::http::status::internal_server_error);
        return;
    }

    auto it = boost::range::find_if(url->params(), [](boost::urls::param p) {
        return p.key == "pk";
    });

    if (it == url->params().end()) {
        spdlog::error("pk not found");
        response.result(boost::beast::http::status::bad_request);
        return;
    }
    auto a = *it;
    auto msgPk = a.value;
    if (msgPk.empty()) {
        spdlog::error("pk is empty");
        response.result(boost::beast::http::status::bad_request);
        return;
    }

    auto model = MailService().findMail(msgPk);
    if (model == std::nullopt) {
        response.result(boost::beast::http::status::not_found);
        return;
    }


    json data = {
            {"pk",      model->pk},
            {"title",   model->title},
            {"content", model->content},
    };


    boost::beast::ostream(response.body()) << data;
}

void MailController::HandleDelete(boost::beast::http::request<boost::beast::http::dynamic_body> &request,
                                  boost::beast::http::response<boost::beast::http::dynamic_body> &response) {
    response.result(boost::beast::http::status::ok);
    response.keep_alive(false);
    response.set(boost::beast::http::field::server, "Beast");

    auto fullUrl = "http://localhost" + std::string(request.target());
    auto url = boost::urls::parse_uri(fullUrl);
    if (url.has_error()) {
        spdlog::error("url parse error: {}", url.error().message());
        response.result(boost::beast::http::status::internal_server_error);
        return;
    }

    std::string msgPk = "";
    for (auto p: url->params()) {
        if (p.key == "pk") {
            msgPk = p.value;
        }
    }
    if (msgPk.empty()) {
        spdlog::error("pk is empty");
        response.result(boost::beast::http::status::bad_request);
        return;
    }

    auto result = MailService().deleteMail(msgPk);
    if (result != 0) {
        response.result(boost::beast::http::status::internal_server_error);
        return;
    }

    json data = {
            {"code", Codes::Ok},
    };

    boost::beast::ostream(response.body()) << data;
}

void MailController::HandleInsert(boost::beast::http::request<boost::beast::http::dynamic_body> &request,
                                  boost::beast::http::response<boost::beast::http::dynamic_body> &response) {

    auto fullUrl = "http://localhost" + std::string(request.target());
    auto url = boost::urls::parse_uri(fullUrl);
    if (url.has_error()) {
        spdlog::error("url parse error: {}", url.error().message());
        response.result(boost::beast::http::status::internal_server_error);
        return;
    }

    std::string title;
    for (auto p: url->params()) {
        if (p.key == "title") {
            title = p.value;
        }
    }
    if (title.empty()) {
        spdlog::error("title is empty");
        response.result(boost::beast::http::status::bad_request);
        return;
    }
    boost::uuids::uuid a_uuid = boost::uuids::random_generator()(); // 这里是两个() ，因为这里是调用的 () 的运算符重载
    const std::string pk = boost::uuids::to_string(a_uuid);

    auto model = MailModel{
            .pk = pk,
            .title = title,
            .content = "content",
            .create_time = std::chrono::system_clock::now(),
            .update_time = std::chrono::system_clock::now(),
            .creator = "creator",
            .sender = "sender",
            .receiver = "receiver",
    };

    auto result = MailService().insertMail(model);
    if (result != 0) {
        response.result(boost::beast::http::status::internal_server_error);
        return;
    }

    json data = {
            {"code", Codes::Ok},
    };
    boost::beast::ostream(response.body()) << data;

}

void MailController::HandleSelect(boost::beast::http::request<boost::beast::http::dynamic_body> &request,
                                  boost::beast::http::response<boost::beast::http::dynamic_body> &response) {

    auto fullUrl = "http://localhost" + std::string(request.target());

    auto url = boost::urls::parse_uri(fullUrl);
    if (url.has_error()) {
        spdlog::error("url parse error: {}", url.error().message());
        response.result(boost::beast::http::status::internal_server_error);
        return;
    }

    auto it = boost::range::find_if(url->params(), [](boost::urls::param p) {
        return p.key == "limit";
    });

    int limit = 10;
    std::string limitString;
    if (it != url->params().end()) {
        limitString = (*it).value;
    }
    if (!limitString.empty()) {
        limit = std::stoi(limitString);
    }

    auto result = MailService().selectMails(limit);
    if (result == std::nullopt) {
        response.result(boost::beast::http::status::not_found);
        return;
    }

    auto count = MailService().count();

    json range = json::array();
    for (auto &m: *result) {
        json item = {
                {"pk",      m.pk},
                {"title",   m.title},
                {"content", m.content},
        };
        range.push_back(item);
    }

    json data = json::object({
                                     {
                                             "count", count
                                     },
                                     {
                                             "range", range,
                                     }
                             });

    json body = json::object({
                                     {
                                             "code", Codes::Ok,
                                     },
                                     {
                                             "data", data
                                     }
                             });
    boost::beast::ostream(response.body()) << body;

}

void MailController::HandleUpdate(boost::beast::http::request<boost::beast::http::dynamic_body> &request,
                                  boost::beast::http::response<boost::beast::http::dynamic_body> &response) {
    response.result(boost::beast::http::status::ok);
    response.keep_alive(false);
    response.set(boost::beast::http::field::server, "Beast");
}

