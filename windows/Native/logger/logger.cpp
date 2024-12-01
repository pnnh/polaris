#include "logger.h"

#include <hstring.h>
#include <iostream>
#include <tchar.h>
#include <spdlog/spdlog.h>
#include <spdlog/sinks/msvc_sink.h>

void calieo::windows::Logger::log(const std::string &message) {

    OutputDebugString(_T("My output string."));

    std::cout << "Native: " << message << std::endl;
    spdlog::info("Native2: {}", message);
    spdlog::error("Native3: {}", message);
}
