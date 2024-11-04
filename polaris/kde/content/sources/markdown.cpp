#include "content/sources/markdown.h"
#include "services/MarkdownService.h"

MarkdownModel::MarkdownModel(QObject *parent) {
}

MarkdownModel::~MarkdownModel() {
}

Q_INVOKABLE QString MarkdownModel::markdownToHtml(QString markdownText) {
//  auto data = markdownText.toUtf8();
//  const char *md = data.constData();
//  auto length = strlen(md);
//  char *html = cmark_markdown_to_html(md, length, CMARK_OPT_DEFAULT);
//  QString htmlText = QString::fromUtf8(html);
//  free(html);
//  return htmlText;
    return markdownToHtml(markdownText);
}
