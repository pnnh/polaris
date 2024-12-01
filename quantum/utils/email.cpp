#include "email.h"

#include <regex>

bool quantum::validateEmail(const std::string& email)
{
    return std::regex_match(email, std::regex(
                                R"(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)"));
}
