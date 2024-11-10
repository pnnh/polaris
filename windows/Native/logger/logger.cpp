#include "logger.h"
#include <iostream>
//#include <spdlog/spdlog.h>
//#include <spdlog/sinks/msvc_sink.h>

void native::Logger::log(const std::string &message) {
  /*  auto sink = std::make_shared<spdlog::sinks::msvc_sink_mt>();
    auto logger = std::make_shared<spdlog::logger>("msvc_logger", sink);
    logger->critical("Use output to view this message.");*/


    std::cout << "Native: " << message << std::endl;
    /*spdlog::info("Native2: {}", message);
    spdlog::error("Native3: {}", message);*/
}
