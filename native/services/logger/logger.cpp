#include "logger.h"

#include <iostream>
#include <spdlog/spdlog.h>
#include <spdlog/sinks/msvc_sink.h>

void native::services::logger::Logger::LogInfo(const std::string& message)
{
    spdlog::info("{}", message);
}
