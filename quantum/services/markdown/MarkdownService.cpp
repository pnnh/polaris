#include "MarkdownService.h"

#include <cstring>

#include "cmark.h"

std::string quantum::markdownToHtml(const std::string& markdownText)
{
  const auto data = markdownText.c_str();
  const char* md = data;
  const auto length = strlen(md);
  char* html = cmark_markdown_to_html(md, length, CMARK_OPT_DEFAULT);
  auto htmlText = std::string(html);
  if (html != nullptr)
    free(html);
  return htmlText;
}
