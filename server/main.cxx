#include "server/process.h"
#include <spdlog/spdlog.h>

import PolarisServerModule;

int main(int argc, char* argv[])
{
  foo f;
  f.helloworld();

#ifndef NDEBUG
  spdlog::set_level(spdlog::level::info);
#endif
  spdlog::info("Server {}", "Started");

  constexpr int PORT = 7501;

  return runServer(PORT);
}
