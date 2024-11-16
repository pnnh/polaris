
#include "Helper.h"

#pragma managed(push, off)
#include <memory>
#include <spdlog/spdlog.h>
#include <spdlog/sinks/msvc_sink.h>

void helper::Helper::Write(const char* message)
{

    auto sink = std::make_shared<spdlog::sinks::msvc_sink_mt>();
    auto logger = std::make_shared<spdlog::logger>("msvc_logger", sink);
    logger->critical("该条日志会打印到Output窗口");

    // 以下日志不会输出到Output窗口
	spdlog::error(message);
    spdlog::debug("i love c++1");
    spdlog::info("i love c++2");
    spdlog::error("i love c++3");
}

#pragma managed(pop)