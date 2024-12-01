#include "logger.h"
#include <iostream>
#include <spdlog/spdlog.h>

void quantum::Logger::log(const std::string& message) {
    std::cout << "Native: " << message << std::endl;
    spdlog::info("Native2: {}", message);
    spdlog::error("Native3: {}", message);
}