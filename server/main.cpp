import foo;

// #include "server/server.h"
// #include "controllers/sitemap.h"
// #include "controllers/message.h"
// #include "controllers/mail.h"

#include "server/process.h"
#include <spdlog/spdlog.h>

int main(int argc, char *argv[]) {
#ifndef NDEBUG
  spdlog::set_level(spdlog::level::debug);
#endif
  spdlog::debug("Hello, {}", "World2!");

  foo f;
  f.helloworld();
  // auto server = PulsarServer();
  // server.RegisterHandler("/sitemap", HandleSitemap);
  // server.RegisterHandler("/message/get", MessageController::HandleGet);
  // server.RegisterHandler("/message/delete", MessageController::HandleDelete);
  // server.RegisterHandler("/message/insert", MessageController::HandleInsert);
  // server.RegisterHandler("/message/update", MessageController::HandleUpdate);
  // server.RegisterHandler("/message/select", MessageController::HandleSelect);
  // server.RegisterHandler("/mail/get", MailController::HandleGet);
  // server.RegisterHandler("/mail/delete", MailController::HandleDelete);
  // server.RegisterHandler("/mail/insert", MailController::HandleInsert);
  // server.RegisterHandler("/mail/update", MailController::HandleUpdate);
  // server.RegisterHandler("/mail/select", MailController::HandleSelect);

  const int PORT = 8501;

  return runServer(PORT);
}
