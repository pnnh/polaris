#include "pulsar/process.h"

#include <iostream>

#include "pulsar/controllers/sitemap.h"
#include "router.h"
#include <workflow/HttpMessage.h>
#include <workflow/HttpUtil.h>
#include <workflow/WFHttpServer.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <spdlog/spdlog.h>
#include <stdlib.h>
#include <string.h>
#include <string>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>

void process(WFHttpTask* httpTask)
{
  pulsar::route_request(httpTask);
}

void loopCmd(const WFHttpServer& httpServer)
{
  std::string cmd;
  while (true)
  {
    std::cout << "等待操作命令..." << std::endl;
    std::getline(std::cin, cmd);
    std::cin.clear();
    if (cmd == "exit")
    {
      break;
    }
  }
}

int pulsar::runServer(int port)
{
  WFHttpServer server(process);

  if (port <= 0)
    port = 8501;

  if (server.start(port) == 0)
  {
    loopCmd(server);
    server.stop();
  }
  else
  {
    perror("server start failed");
    exit(1);
  }
  return 0;
}
