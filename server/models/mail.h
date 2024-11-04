//
// Created by azureuser on 4/10/23.
//

#ifndef PULSAR_MAIL_H
#define PULSAR_MAIL_H


#include <chrono>
#include <string>

struct MailModel {
    std::string uid;
    std::string title;
    std::string content;
    std::chrono::system_clock::time_point create_time;
    std::chrono::system_clock::time_point update_time;
    std::string creator;
    std::string sender;
    std::string receiver;
};


#endif //PULSAR_MAIL_H
