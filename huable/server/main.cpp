#include "huable/server/process.h"
#include <spdlog/spdlog.h>
#include "huable/server/syncer/syncer.h"

static void signal_handler(int sig)
{
  printf("core dumped...%d\n", sig);
  /*
  // to do something
  */
  exit(1);
}

int main(int argc, char* argv[])
{
  signal(SIGSEGV, signal_handler);
#ifndef NDEBUG
  spdlog::set_level(spdlog::level::info);
#endif
  spdlog::info("Server {}", "Started");

  std::thread syncer(huable::server::runSync);

  constexpr int PORT = 7101;

  return huable::server::runServer(PORT);
}
