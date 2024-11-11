#include "logger.h"

#include <iostream>
#include <spdlog/spdlog.h>
#include <spdlog/sinks/msvc_sink.h>

void native::services::logger::Logger::LogInfo(const std::string& message)
{
    // std::cout << "Native: " << message << std::endl;
    spdlog::info("LogInfo: {}", message);
    // spdlog::error("Native3: {}", message);
}
