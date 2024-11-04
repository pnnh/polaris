#pragma once

#include <string>
#include <chrono>

std::chrono::system_clock::time_point makeTimePoint(const std::string &s);

std::string formatTime(const std::chrono::system_clock::time_point &time_point);

