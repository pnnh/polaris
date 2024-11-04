#pragma once
#include <optional>
#include <vector>
#include <pqxx/pqxx>
#include "server/models/mail.h"

class MailService {
public:
    MailService();

    ~MailService();

    std::optional<std::vector<MailModel>> selectMails(int limit);

    int insertMail(const MailModel &model);

    int updateMail(const MailModel &model);

    int deleteMail(const std::string &pk);

    std::optional<MailModel> findMail(const std::string &pk);

    long count();

private:
    pqxx::connection connection;
};
