#include "content/sources/markdown.h"
#include "calieo/telescope/services/markdown/MarkdownService.h"

MarkdownModel::MarkdownModel(QObject* parent)
{
}

MarkdownModel::~MarkdownModel()
{
}

Q_INVOKABLE QString MarkdownModel::markdownToHtml(QString markdownText)
{
    auto stdMarkText = markdownText.toStdString();
    auto stdHtmlText = calieo::telescope::markdownToHtml(stdMarkText);
    return QString::fromStdString(stdHtmlText);
}
