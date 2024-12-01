#include "logger.h"

#include <iostream>

void quantum::Logger::LogInfo(const std::string& message)
{
    std::cout << "[INFO] " << message << std::endl;
}

void quantum::Logger::LogInfo(std::initializer_list<std::string> messageList)
{
    std::string fullMessage;
    for (const std::string& item : messageList)
    {
        fullMessage += " " + item;
    }
    std::cout << "[INFO] " << fullMessage << std::endl;
}
