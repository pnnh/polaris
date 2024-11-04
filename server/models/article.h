#pragma once

#include <chrono>
#include <string>

struct ArticleModel
{
  std::string uid;
  long nid;
  std::string title;
  std::string header;
  std::string body;
  std::string keywords;
  std::string description;
  std::chrono::system_clock::time_point create_time;
  std::chrono::system_clock::time_point update_time;
};

