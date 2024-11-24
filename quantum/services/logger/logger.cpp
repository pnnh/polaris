#include "logger.h"

#include <iostream>

void polaris::base::Logger::LogInfo(const std::string& message)
{
    std::cout << "[INFO] " << message << std::endl;
}

void polaris::base::Logger::LogInfo(std::initializer_list<std::string> messageList)
{
    std::string fullMessage;
    for (const std::string& item : messageList)
    {
        fullMessage += " " + item;
    }
    std::cout << "[INFO] " << fullMessage << std::endl;
}
