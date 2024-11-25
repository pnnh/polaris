#include "huable/server/process.h"

#include <iostream>

#include "huable/server/controllers/article.h"
#include "huable/server/controllers/sitemap.h"
#include "router.h"
#include <workflow/HttpMessage.h>
#include <workflow/HttpUtil.h>
#include <workflow/WFHttpServer.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <spdlog/spdlog.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <string>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>
#include <workflow/WFHttpServer.h>

#include "controllers/index.h"
#include "controllers/channel.h"
#include "controllers/filesystem/filesystem.h"

void process(WFHttpTask* httpTask)
{
  protocol::HttpRequest* request = httpTask->get_req();
  protocol::HttpResponse* response = httpTask->get_resp();

  polaris::server::route_request(httpTask);

  return;

  long long seq = httpTask->get_task_seq();
  protocol::HttpHeaderCursor cursor(request);
  std::string name;
  std::string value;
  char buf[8192];
  int len;

  response->append_output_body_nocopy("<html>", 6);
  len = snprintf(buf, 8192, "<p>%s %s %s</p>", request->get_method(),
                 request->get_request_uri(), request->get_http_version());
  response->append_output_body(buf, len);

  while (cursor.next(name, value))
  {
    len = snprintf(buf, 8192, "<p>%s: %s</p>", name.c_str(), value.c_str());
    response->append_output_body(buf, len);
  }

  response->append_output_body_nocopy("</html>", 7);

  response->set_http_version("HTTP/1.1");
  response->set_status_code("200");
  response->set_reason_phrase("OK");

  response->add_header_pair("Content-Type", "text/html");
  response->add_header_pair("Server", "Sogou WFHttpServer");
  if (seq == 9)
  {
    response->add_header_pair("Connection", "close");
  }
  else
  {
    response->add_header_pair("Connection", "keep-alive");
  }

  char addrstr[128];
  struct sockaddr_storage addr;
  socklen_t l = sizeof addr;
  unsigned short port = 0;

  httpTask->get_peer_addr((struct sockaddr*)&addr, &l);

  if (addr.ss_family == AF_INET)
  {
    struct sockaddr_in* s = (struct sockaddr_in*)&addr;
    port = ntohs(s->sin_port);
    inet_ntop(AF_INET, &s->sin_addr, addrstr, sizeof addrstr);
  }
  else if (addr.ss_family == AF_INET6)
  {
    struct sockaddr_in6* s = (struct sockaddr_in6*)&addr;
    port = ntohs(s->sin6_port);
    inet_ntop(AF_INET6, &s->sin6_addr, addrstr, sizeof addrstr);
  }
  else
  {
    strcpy(addrstr, "unknown");
  }

  fprintf(stderr, "seq: %lld, peer: %s:%hu\n", seq, addrstr, port);
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

int polaris::server::runServer(int port)
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
