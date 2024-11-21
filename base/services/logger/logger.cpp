#include "logger.h"

#include <iostream>
#include <spdlog/spdlog.h>
#include <spdlog/sinks/msvc_sink.h>

void polaris::base::Logger::LogInfo(const std::string& message)
{
    spdlog::info("{}", message);
}

void polaris::base::Logger::LogInfo(std::initializer_list<std::string> messageList)
{
    std::string fullMessage;
    for (const std::string& item : messageList)
    {
        fullMessage += " " + item;
    }
    spdlog::info("{}", fullMessage);
}
