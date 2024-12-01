#include "content/sources/markdown.h"
#include "weable/dawn/services/markdown/MarkdownService.h"

MarkdownModel::MarkdownModel(QObject* parent)
{
}

MarkdownModel::~MarkdownModel()
{
}

Q_INVOKABLE QString MarkdownModel::markdownToHtml(QString markdownText)
{
    auto stdMarkText = markdownText.toStdString();
    auto stdHtmlText = weable::dawn::markdownToHtml(stdMarkText);
    return QString::fromStdString(stdHtmlText);
}
