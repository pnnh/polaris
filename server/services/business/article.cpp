#include "server/services/business/article.h"
#include "common/utils/datetime.h"
#include "common/utils/uuid.h"
#include "server/services/config/appconfig.h"
#include <date/date.h>
#include <spdlog/spdlog.h>

MessageService::MessageService() : connection(AppConfig::Default().GetDSN()) {
  if (!this->connection.is_open()) {
    throw std::runtime_error("Can't open database");
  }
}

std::optional<std::vector<ArticleModel>>
MessageService::selectMessages(int limit) {
  std::vector<ArticleModel> articlesList;
  const char *sqlText = "select uid, nid, title, header, body, keywords, "
                        "description, create_time, update_time "
                        "from posts order by update_time desc limit $1;";
  pqxx::nontransaction N(this->connection);
  pqxx::result R(N.exec_params(sqlText, limit));

  for (pqxx::result::const_iterator itr = R.begin(); itr != R.end(); ++itr) {
    auto model = ArticleModel{
        .uid = itr[0].as<std::string>(),
        .nid = itr[1].as<long>(),
        .title = itr[2].as<std::string>(),
        .header = itr[3].as<std::string>(),
        .body = itr[4].as<std::string>(),
        .keywords = itr[5].as<std::string>(),
        .description = itr[6].as<std::string>(),
        .create_time = makeTimePoint(itr[7].as<std::string>()),
        .update_time = makeTimePoint(itr[8].as<std::string>()),
    };
    articlesList.push_back(model);
  }
  return articlesList;
}

std::optional<ArticleModel>
MessageService::findMessage(const std::optional<std::string> &uid,
                            const std::optional<long> &nid) {
  std::string sqlText = "select uid, nid, title, header, body, keywords, "
                        "description, create_time, update_time "
                        "from posts where ";

  std::string pk;
  if (uid != std::nullopt && UUIDHelper::isUUID(uid.value())) {
    sqlText += " uid = $1;";
    pk = uid.value();
  } else if (nid != std::nullopt) {
    sqlText += " nid = $1;";
    pk = std::to_string(nid.value());
  } else {
    return std::nullopt;
  }

  pqxx::nontransaction N(this->connection);
  pqxx::result R(N.exec_params(sqlText, pk));

  for (pqxx::result::const_iterator itr = R.begin(); itr != R.end();) {
    auto model = ArticleModel{
        .uid = itr[0].as<std::string>(),
        .nid = itr[1].as<long>(),
        .title = itr[2].as<std::string>(),
        .header = itr[3].as<std::string>(),
        .body = itr[4].as<std::string>(),
        .keywords = itr[5].as<std::string>(),
        .description = itr[6].as<std::string>(),
        .create_time = makeTimePoint(itr[7].as<std::string>()),
        .update_time = makeTimePoint(itr[8].as<std::string>()),
    };
    return model;
  }
  return std::nullopt;
}

int MessageService::insertMessage(const ArticleModel &model) {
  const char *sqlText =
      "insert into messages (uid, title, content, create_time, update_time, "
      "creator, sender, receiver) "
      "values ($1, $2, $3, to_timestamp($4, 'YYYY-MM-DDTHH24:MI:SS.USZ'), "
      "to_timestamp($5, 'YYYY-MM-DDTHH24:MI:SS.USZ'), $6, $7, $8);";

  pqxx::work W(this->connection);
  auto createTime = date::format(
      "%FT%TZ", time_point_cast<std::chrono::microseconds>(model.create_time));
  auto updateTime = date::format(
      "%FT%TZ", time_point_cast<std::chrono::microseconds>(model.update_time));
  W.exec_params(sqlText, model.uid, model.title, model.body, createTime,
                updateTime);
  W.commit();

  return 0;
}

int MessageService::updateMessage(const ArticleModel &model) {
  const char *sqlText = "update messages set title = $1, content = $2, "
                        "update_time = $3, sender = $4, receiver = $5 "
                        "where uid = $6;";

  pqxx::work W(this->connection);
  W.exec_params(sqlText, model.title, model.body,
                model.update_time.time_since_epoch().count(), model.title,
                model.title, model.uid);
  W.commit();

  return 0;
}

int MessageService::deleteMessage(const std::string &uid) {
  const char *sqlText = "delete from messages where uid = $1;";

  pqxx::work W(this->connection);
  W.exec_params(sqlText, uid);
  W.commit();

  return 0;
}

long MessageService::count() {
  const char *sqlText = "select count(*) from messages;";
  pqxx::nontransaction N(this->connection);
  pqxx::result R(N.exec(sqlText));

  for (pqxx::result::const_iterator itr = R.begin(); itr != R.end();) {
    return itr[0].as<long>();
  }
  throw std::runtime_error("Can't get count");
}
