#include "content/sources/markdown.h"
#include "huable/starlight/services/markdown/MarkdownService.h"

MarkdownModel::MarkdownModel(QObject* parent)
{
}

MarkdownModel::~MarkdownModel()
{
}

Q_INVOKABLE QString MarkdownModel::markdownToHtml(QString markdownText)
{
    auto stdMarkText = markdownText.toStdString();
    auto stdHtmlText = huable::starlight::markdownToHtml(stdMarkText);
    return QString::fromStdString(stdHtmlText);
}
