#ifndef PS_CONTENT_MODELS_MARKDOWN_H
#define PS_CONTENT_MODELS_MARKDOWN_H

#include <QtCore>
#include <QtQml/qqmlregistration.h>

class MarkdownModel : public QObject
{
  Q_OBJECT
  QML_ELEMENT
public:
  explicit MarkdownModel(QObject *parent = nullptr);
  ~MarkdownModel() override;

  Q_INVOKABLE QString markdownToHtml(QString markdownText);
};

#endif // PS_CONTENT_MODELS_MARKDOWN_H
