#include "content/sources/markdown.h"
#include "native/services/markdown/MarkdownService.h"

MarkdownModel::MarkdownModel(QObject* parent)
{
}

MarkdownModel::~MarkdownModel()
{
}

Q_INVOKABLE QString MarkdownModel::markdownToHtml(QString markdownText)
{
    auto stdMarkText = markdownText.toStdString();
    auto stdHtmlText = polaris::native::markdownToHtml(stdMarkText);
    return QString::fromStdString(stdHtmlText);
}
