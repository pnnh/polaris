#include "pulsar/process.h"
#include <spdlog/spdlog.h>
#include "services/syncer/syncer.h"

int main(int argc, char* argv[])
{
#ifndef NDEBUG
  spdlog::set_level(spdlog::level::info);
#endif

  constexpr int PORT = 7101;

  spdlog::info("Server started {}", 7101);

  std::thread syncer(pulsar::runSync);

  return pulsar::runServer(PORT);
}
