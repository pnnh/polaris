extern "C" {
#include "libMultiMarkdown/libMultiMarkdown.h"
#include <stdio.h>
}

#include "markdown.h"
#include "server/services/markdown/mdtransform.h" // 需要实现的 Markdown 解析类
#include <folly/Uri.h>
#include <fstream> // std::ofstream
#include <iostream>
#include <spdlog/spdlog.h>
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/xml_parser.hpp>
#include <boost/typeof/typeof.hpp>
#include <boost/iostreams/stream.hpp>
#include <boost/iostreams/stream_buffer.hpp>
#include <boost/algorithm/string.hpp>
#include <boost/algorithm/string/replace.hpp>
#include <inja/inja.hpp>
#include <inja/environment.hpp>
#include <inja/template.hpp>
#include <nlohmann/json.hpp>
#include <folly/FileUtil.h>
#include <folly/String.h>
//#include <QDomDocument>
#include <fmt/core.h>

void HandleMarkdown(
    boost::beast::http::response<boost::beast::http::dynamic_body> &response_) {

  // 装载构造 Markdown 文件
  MarkdownTransform transformer("assets/test.md");

  // 编写一个 `getTableOfContents()` 方法来获取 Markdown 文件 HTML 格式的目录
  std::string table = transformer.getTableOfContents();

  // 编写一个 `getContents()` 方法来获取 Markdown 转成 HTML 后的内容
  std::string contents = transformer.getContents();

  // 准备要写入的 HTML 文件头尾信息
  std::string head = "<!DOCTYPE html><html><head>\
        <meta charset=\"utf-8\">\
        <title>Markdown</title>\
        <link rel=\"stylesheet\" href=\"github-markdown.css\">\
        </head><body><article class=\"markdown-body\">";
  std::string end = "</article></body></html>";

  response_.result(boost::beast::http::status::ok);
  response_.keep_alive(false);
  response_.set(boost::beast::http::field::server, "Beast");
  response_.set(boost::beast::http::field::content_type, "text/html");

  boost::beast::ostream(response_.body()) << head + table + contents + end;
}

std::string render_html(ArticleModel &article, std::string body_html, std::string toc_html) {
  inja::Environment env;

  nlohmann::json data;
  data["body_html"] = body_html;
  data["toc_html"] = toc_html;

  data["pk"] = "pk";
  // data["headmeta"] = "headmeta";
  // data["analytics"] = "analytics";
  data["title"] = article.title;
  // data["styles"] = "styles";
  // data["header"] = "header";
  // data["scripts"] = "scripts";
  data["keywords"] = article.keywords;
  data["description"] = article.description;

  env.add_callback("reslink", 2, [](inja::Arguments& args) {
    auto debugUri = args.at(0)->get<std::string>();
    auto releaseUri = args.at(1)->get<std::string>();
    #ifndef NDEBUG
      return debugUri;
    #endif
    return releaseUri;
  });

  inja::Template headmeta_template = env.parse_template("assets/templates/partial/headmeta.html");
  env.include_template("headmeta", headmeta_template);
  inja::Template analytics_template = env.parse_template("assets/templates/partial/analytics.html");
  env.include_template("analytics", analytics_template);
  inja::Template header_template = env.parse_template("assets/templates/partial/header.html");
  env.include_template("header", header_template);
  inja::Template footer_template = env.parse_template("assets/templates/partial/footer.html");
  env.include_template("footer", footer_template);
  inja::Template styles_template = env.parse_template("assets/templates/partial/styles.html");
  env.include_template("styles", styles_template);
  inja::Template scripts_template = env.parse_template("assets/templates/partial/scripts.html");
  env.include_template("scripts", scripts_template);  

  inja::Template temp = env.parse_template("assets/templates/pages/articles/markdown.html");
  std::string result = env.render(temp, data); 

  return result;
}

    

// std::string fill_toc(QDomDocument &doc, int header_level) {
//   auto header_title = fmt::format("h{}", header_level);
//   auto h1Nodes = doc.elementsByTagName(QString::fromStdString(header_title));
//   spdlog::debug("fill_toc: {} {}", header_title, h1Nodes.count());
//   std::stringstream toc_list;
//   constexpr auto toc_templ = "<div class='toc-item' style='padding-left: calc(8px*{});'>"
//                       "<a class='fx-link' href='#{}' title='{}'>{}</a>"
//                       "</div>\n";
//   for (int i = 0; i < h1Nodes.count(); i++) {
//     QDomElement node = h1Nodes.at(i).toElement();
//     auto header_text = node.text().toStdString();
//     spdlog::debug("h1node: {}", header_text);
//     toc_list << fmt::format(toc_templ, header_level, header_text, header_text, header_text);
//   }
//   return toc_list.str();
// }

// std::string render_toc(std::string body_html, std::string article_title) {
//    QDomDocument doc("document");
//     //spdlog::debug("render_toc: {}", body_html);
//    QString bodyHtmlQStr = QString::fromStdString(body_html);
//    QString errorString;
//    if (!doc.setContent(bodyHtmlQStr, &errorString)) {
//     spdlog::error("toc QDomDocument未初始化成功: {}", errorString.toStdString());
//     return "";
//    }
//   constexpr auto toc_templ = "<div class='toc-item' style='padding-left: calc(8px*{});'>"
//                       "<a class='fx-link' href='#{}' title='{}'>{}</a>"
//                       "</div>\n";
//    std::stringstream toc_list;
//     toc_list << fmt::format(toc_templ, 0, article_title, article_title, article_title);
//    for(int n=1; n<=6;n++) {
//     toc_list << fill_toc(doc, n);
//    }
  
//   return toc_list.str();
// }

void HandleMarkdown2(
    boost::beast::http::request<boost::beast::http::dynamic_body> &request_,
    boost::beast::http::response<boost::beast::http::dynamic_body> &response_) {
  try { 
  auto url = "http://localhost" + request_.target().to_string();

  std::cout << "print_uri: " << url << std::endl;
  folly::Uri uri(url);
  const auto authority =
      fmt::format("The authority from {} is {}", uri.fbstr(), uri.authority());
  std::cout << "authority: " << authority << std::endl;
  std::cout << "path: " << uri.path() << std::endl;
  // auto queryParams = uri.getQueryParams();

  std::string queryPk = boost::algorithm::replace_first_copy(uri.path(), "/blog/articles/", ""); 

  // std::string queryPk;
  // for (auto iter = queryParams.begin(); iter != queryParams.end(); iter++) {
  //   std::cout << "query param " << (*iter).first << ":" << (*iter).second
  //             << std::endl;
  //   if ((*iter).first == "pk") {
  //     queryPk = (*iter).second;
  //   }
  // }
  std::cout << "queryContent: " << queryPk << std::endl;

  spdlog::info("i love c++");
  std::cout << "Hello, World!" << std::endl;

  auto pk = queryPk; // "dC-VN4ZikNL2";

  auto article = queryArticle(pk);
  spdlog::info("queryArticle {}", article.title);
  // std::cout << "queryArticle2 " << article.mark_text << std::endl;

  std::string content;

  if (article.mark_lang == 1 && !article.mark_text.empty()) {

    // const char *source = "# hello\nworld";

    char *target = mmd_string_convert(article.mark_text.c_str(), EXT_COMPLETE,
                                      FORMAT_HTML, ENGLISH);
    // printf("%s", target);
    content = std::string{target};
    free(target);
  }
  boost::property_tree::ptree pt;

  std::string content_xml = boost::algorithm::replace_first_copy(content, "<!DOCTYPE html>", ""); 
  //spdlog::debug("content_xml: \n {}", content_xml);

  istringstream content_stream(content_xml);
  boost::property_tree::read_xml(content_stream, pt);

  boost::property_tree::ptree html_body = pt.get_child("html.body");

  std::ostringstream oss;
  boost::property_tree::write_xml(oss, html_body);

  //spdlog::debug("html body: {}", oss.str());
 
  auto body_html = boost::algorithm::replace_first_copy(oss.str(), "<?xml version=\"1.0\" encoding=\"utf-8\"?>", ""); 


  // std::ifstream infile;
  // infile.open("assets/templates/markdown.html");
  // std::ostringstream template_buffer;
  // template_buffer << infile.rdbuf();
  // std::string template_string = template_buffer.str();
  // std::string template_string;
  // folly::readFile("assets/templates/markdown.html", template_string);
  // spdlog::debug("template_string: {}", template_string);

  std::string body_html_trimed = folly::to<std::string>(folly::trimWhitespace(body_html));

  //auto result  = inja::render(template_string, data); 
  std::string toc_html = "<html><body></body></html>";//render_toc(content_xml, article.title);
  //spdlog::debug("toc_html: {}", toc_html);
  auto result = render_html(article, body_html_trimed, toc_html);
  //spdlog::debug("result: {}", result);

  response_.result(boost::beast::http::status::ok);
  response_.keep_alive(false);
  response_.set(boost::beast::http::field::server, "Beast");
  response_.set(boost::beast::http::field::content_type, "text/html");

  boost::beast::ostream(response_.body()) << result;

   }catch (std::exception const&  ex) {
    spdlog::error("Markdown2 error: {}", ex.what());
    response_.result(boost::beast::http::status::internal_server_error); 
    response_.set(boost::beast::http::field::server, "Beast");
    response_.set(boost::beast::http::field::content_type, "text/html; charset=utf-8"); 
    boost::beast::ostream(response_.body()) << "出现错误";
   }
}
