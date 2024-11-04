#include "sitemap.h"
#include "common/utils/datetime.h"
#include "server/services/business/article.h"
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/xml_parser.hpp>

void HandleSitemap(WFHttpTask *httpTask) {
  //protocol::HttpRequest *request = httpTask->get_req();
  protocol::HttpResponse *response = httpTask->get_resp();

  response->set_http_version("HTTP/1.1");
  response->add_header_pair("Content-Type", "text/xml");
  response->add_header_pair("Server", "Sogou WFHttpServer");
  response->add_header_pair("Connection", "Close");

  boost::property_tree::ptree pt;

  pt.put("urlset.<xmlattr>.xmlns",
         "http://www.sitemaps.org/schemas/sitemap/0.9");
  boost::property_tree::ptree homeNode;
  homeNode.put("url.loc", "https://sfx.xyz/");
  pt.add_child("urlset.url", homeNode.get_child("url"));

  auto articlesList = MessageService().selectMessages(100);
  if (articlesList == std::nullopt) {
    response->set_status_code("500");
    return;
  }
  for (const auto &article : *articlesList) {
    boost::property_tree::ptree urlNode;
    urlNode.put("url.loc", "https://sfx.xyz/article/read/" + article.uid);
    urlNode.put("url.lastmod", formatTime(article.update_time));
    pt.add_child("urlset.url", urlNode.get_child("url"));
  }
  std::ostringstream oss;
  boost::property_tree::write_xml(oss, pt);

  auto bodyStr = oss.str();
  auto bodySize = bodyStr.size();

  response->append_output_body(bodyStr.c_str(), bodySize);

  response->set_status_code("200");
}