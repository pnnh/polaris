
#include "mail.h"
#include "server/services/config/appconfig.h"
#include "common/utils/datetime.h"
#include <date/date.h>
#include <pqxx/pqxx>
#include <spdlog/spdlog.h>

MailService::MailService() : connection(AppConfig::Default().GetDSN()) {
  if (!this->connection.is_open()) {
    throw std::runtime_error("Can't open database");
  }
}

MailService::~MailService() { this->connection.close(); }

std::optional<std::vector<MailModel>> MailService::selectMails(int limit) {
  std::vector<MailModel> articlesList;
  const char *sqlText =
      "select  uid, title, content, create_time, update_time, "
      "creator, sender, receiver "
      "from mails order by update_time desc limit $1;";
  pqxx::nontransaction N(this->connection);
  pqxx::result R(N.exec_params(sqlText, limit));

  for (pqxx::result::const_iterator itr = R.begin(); itr != R.end(); ++itr) {
    auto model = MailModel{
        .uid = itr[0].as<std::string>(),
        .title = itr[1].as<std::string>(),
        .content = itr[2].as<std::string>(),
        .create_time = makeTimePoint(itr[3].as<std::string>()),
        .update_time = makeTimePoint(itr[4].as<std::string>()),
        .creator = itr[5].as<std::string>(),
        .sender = itr[6].as<std::string>(),
        .receiver = itr[7].as<std::string>(),
    };
    articlesList.push_back(model);
  }
  return articlesList;
}

std::optional<MailModel> MailService::findMail(const std::string &uid) {
  const char *sqlText = "select uid, title, content, create_time, update_time, "
                        "creator, sender, receiver "
                        "from mails where uid = $1;";
  pqxx::nontransaction N(this->connection);
  pqxx::result R(N.exec_params(sqlText, uid));

  for (pqxx::result::const_iterator itr = R.begin(); itr != R.end();) {
    auto model = MailModel{
        .uid = itr[0].as<std::string>(),
        .title = itr[1].as<std::string>(),
        .content = itr[2].as<std::string>(),
        .create_time = makeTimePoint(itr[3].as<std::string>()),
        .update_time = makeTimePoint(itr[4].as<std::string>()),
        .creator = itr[5].as<std::string>(),
        .sender = itr[6].as<std::string>(),
        .receiver = itr[7].as<std::string>(),
    };
    return model;
  }
  return std::nullopt;
}

int MailService::insertMail(const MailModel &model) {
  const char *sqlText =
      "insert into mails (uid, title, content, create_time, update_time, "
      "creator, sender, receiver) "
      "values ($1, $2, $3, to_timestamp($4, 'YYYY-MM-DDTHH24:MI:SS.USZ'), "
      "to_timestamp($5, 'YYYY-MM-DDTHH24:MI:SS.USZ'), $6, $7, $8);";

  pqxx::work W(this->connection);
  auto createTime = date::format(
      "%FT%TZ", time_point_cast<std::chrono::microseconds>(model.create_time));
  auto updateTime = date::format(
      "%FT%TZ", time_point_cast<std::chrono::microseconds>(model.update_time));
  W.exec_params(sqlText, model.uid, model.title, model.content, createTime,
                updateTime, model.creator, model.sender, model.receiver);
  W.commit();

  return 0;
}

int MailService::updateMail(const MailModel &model) {
  const char *sqlText = "update mails set title = $1, content = $2, "
                        "update_time = $3, sender = $4, receiver = $5 "
                        "where uid = $6;";

  pqxx::work W(this->connection);
  W.exec_params(sqlText, model.title, model.content,
                model.update_time.time_since_epoch().count(), model.sender,
                model.receiver, model.uid);
  W.commit();

  return 0;
}

int MailService::deleteMail(const std::string &uid) {
  const char *sqlText = "delete from mails where uid = $1;";

  pqxx::work W(this->connection);
  W.exec_params(sqlText, uid);
  W.commit();

  return 0;
}

long MailService::count() {
  const char *sqlText = "select count(*) from mails;";
  pqxx::nontransaction N(this->connection);
  pqxx::result R(N.exec(sqlText));

  for (pqxx::result::const_iterator itr = R.begin(); itr != R.end();) {
    return itr[0].as<long>();
  }
  throw std::runtime_error("Can't get count");
}
