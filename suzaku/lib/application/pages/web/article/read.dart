import 'package:flutter/material.dart';
import 'package:flutter_highlight/flutter_highlight.dart';
import 'package:flutter_highlight/themes/github.dart';
import 'package:markdown_widget/markdown_widget.dart';
import 'package:polaris/application/pages/partial/not_found.dart';
import 'package:polaris/application/pages/partial/page_loading.dart';
import 'package:polaris/models/article.dart';
import 'package:polaris/services/web/articles.dart';

class TocItem {
  String title = "";
  int header = 0;
}

class WArticleReadPage extends StatefulWidget {
  final Map<String, String> queryParameters;

  const WArticleReadPage(this.queryParameters, {super.key});

  @override
  State<WArticleReadPage> createState() => _WArticleReadPageState();
}

class _WArticleReadPageState extends State<WArticleReadPage> {
  @override
  Widget build(BuildContext context) {
    if (!widget.queryParameters.containsKey("pk")) {
      return const NotFoundWidget();
    }
    var pk = widget.queryParameters["pk"] as String;
    if (pk.isEmpty) {
      return const NotFoundWidget();
    }

    return FutureBuilder<ArticleModel?>(
        future: WArticleService.getArticle(pk),
        builder: (BuildContext context, AsyncSnapshot<ArticleModel?> snapshot) {
          if (snapshot.hasError) {
            return Text("加载出错1 ${snapshot.error}");
          }

          if (!snapshot.hasData) {
            return const PageLoadingWidget();
          }
          var model = snapshot.data;
          if (model == null) {
            return const Center(
              child: Text("文章不存在"),
            );
          }
          var tocList = <TocItem>[];
          var tocItem = TocItem()
            ..header = 0
            ..title = model.title;
          tocList.add(tocItem);
          return Scaffold(
            appBar: AppBar(
              title: const Text("北极星"),
            ),
            body: SafeArea(
              child: SingleChildScrollView(
                  physics: const ClampingScrollPhysics(),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Container(
                      //   height: 240,
                      //   decoration: BoxDecoration(
                      //       color: Colors.white,
                      //       borderRadius: BorderRadius.circular(4)),
                      //   child: Image.network(
                      //     AppHelper.filesUrl(model.cover),
                      //     fit: BoxFit.cover,
                      //   ),
                      // ),
                      const SizedBox(height: 16),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(4)),
                            child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    model.title,
                                    style: const TextStyle(fontSize: 20),
                                  ),
                                ]),
                          ),
                          const SizedBox(
                            height: 8,
                          ),
                          Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(4)),
                              margin: const EdgeInsets.only(bottom: 8),
                              child: Container(
                                padding: const EdgeInsets.all(8),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: MarkdownGenerator()
                                          .buildWidgets(model.body ?? "") ??
                                      [],
                                ),
                              ))
                        ],
                      ),
                    ],
                  )),
            ),
          );
        });
  }

  Widget buildBody(BuildContext context, List<TocItem> tocList,
      Map<String, dynamic> bodyJson) {
    if (bodyJson["children"] is! List<dynamic>) {
      return const Center(
        child: Text("无效正文"),
      );
    }
    var children = bodyJson["children"] as List<dynamic>;
    var list = <Widget>[];
    for (var element in children) {
      list.add(buildNode(context, tocList, element));
    }
    var widget = Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: List.generate(list.length, (index) => list[index]));
    return widget;
  }

  Widget buildNode(BuildContext context, List<TocItem> tocList,
      Map<String, dynamic> nodeJson) {
    var name = nodeJson["name"] as String;
    switch (name) {
      case "paragraph":
        return buildParagraph(context, nodeJson);
      case "header":
        return buildHeader(context, tocList, nodeJson);
      case "code-block":
        return buildCodeBlock(context, nodeJson);
    }
    return const Text("未知节点");
  }

  Widget buildParagraph(BuildContext context, Map<String, dynamic> nodeJson) {
    var children = nodeJson["children"] as List<dynamic>;
    var text = "";
    for (var element in children) {
      text += buildText(context, element);
    }

    var widget = Container(
      margin: const EdgeInsets.only(bottom: 8, top: 8),
      child: Text(text),
    );
    return widget;
  }

  String buildText(BuildContext context, Map<String, dynamic> nodeJson) {
    var text = nodeJson["text"] as String;
    return text;
  }

  Widget buildHeader(BuildContext context, List<TocItem> tocList,
      Map<String, dynamic> nodeJson) {
    if (nodeJson["header"] is! int) {
      return const Text("无效标题");
    }
    var header = nodeJson["header"] as int;

    var children = nodeJson["children"] as List<dynamic>;
    var text = "";
    for (var element in children) {
      text += buildText(context, element);
    }

    var tocItem = TocItem()
      ..header = header
      ..title = text;
    tocList.add(tocItem);
    var widget = Container(
      margin: const EdgeInsets.only(bottom: 8, top: 8),
      child: Text(text, style: TextStyle(fontSize: header * 8)),
    );
    return widget;
  }

  Widget buildCodeBlock(BuildContext context, Map<String, dynamic> nodeJson) {
    var children = nodeJson["children"] as List<dynamic>;
    var text = "";
    for (var element in children) {
      text += buildText(context, element);
    }

    var widget = Container(
      margin: const EdgeInsets.only(bottom: 8, top: 8),
      child: HighlightView(
        // The original code to be highlighted
        text,

        // Specify language
        // It is recommended to give it a value for performance
        language: 'dart',

        // Specify highlight theme
        // All available themes are listed in `themes` folder
        theme: githubTheme,

        // Specify padding
        padding: const EdgeInsets.all(12),

        // Specify text style
        textStyle: const TextStyle(
          fontSize: 16,
        ),
      ),
    );
    return Row(
      children: [Expanded(child: widget)],
    );
  }

  Widget buildKeywordsList(List<String> keywordsList) {
    return Container(
      padding: const EdgeInsets.only(
        top: 16,
      ),
      child: Row(
          children: List.generate(keywordsList.length, (index) {
        var keywordText = keywordsList[index];
        if (keywordText.isEmpty) {
          return Container();
        }
        return Container(
          padding: const EdgeInsets.all(4),
          margin: const EdgeInsets.only(right: 8),
          decoration: BoxDecoration(
              color: const Color(0xffefefef),
              borderRadius: BorderRadius.circular(4)),
          child: Text(
            keywordsList[index],
            style: const TextStyle(fontSize: 12),
          ),
        );
      })),
    );
  }

  Widget buildTocList(List<TocItem> tocList) {
    return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: List.generate(tocList.length, (index) {
          var item = tocList[index];
          return Container(
            padding: EdgeInsets.only(left: item.header * 8, bottom: 8),
            child: Text(tocList[index].title),
          );
        }));
  }
}
