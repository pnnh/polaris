
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'header.dart';

class ArticleCreatePage extends StatefulWidget {
  const ArticleCreatePage({super.key});

  @override
  State<ArticleCreatePage> createState() => _ArticleCreatePageState();
}

class _ArticleCreatePageState extends State<ArticleCreatePage> {
  TextEditingController titleController = TextEditingController(text: "新文章");
  TextEditingController bodyController = TextEditingController(text: "正文");
  String errorMessage = '';

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
        physics: const ClampingScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const HeaderWidget(),
            const SizedBox(height: 16),
            Container(
                width: 1024,
                color: Colors.white,
                child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        width: 240,
                        height: 48,
                        child: Focus(
                            child: TextField(
                              autofocus: true,
                              keyboardType: TextInputType.text,
                              style: const TextStyle(fontSize: 14),
                              decoration: InputDecoration(
                                hoverColor: Colors.white,
                                hintText: '请输入标题',
                                hintStyle: const TextStyle(fontSize: 14),
                                contentPadding:
                                    const EdgeInsets.only(left: 8, top: 4),
                                filled: true,
                                fillColor: Colors.white,
                                border: OutlineInputBorder(
                                  borderSide: const BorderSide(
                                      color: Color.fromRGBO(240, 240, 240, 100),
                                      width: 1,
                                      style: BorderStyle.solid),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                              ),
                              controller: titleController,
                            ),
                            onFocusChange: (hasFocus) {
                              setState(() {
                                errorMessage = titleController.text.isEmpty
                                    ? "标题不可为空"
                                    : "";
                              });
                            }),
                      ),
                      Container(
                        padding: const EdgeInsets.all(8),
                        height: 480,
                        child: TextField(
                          keyboardType: TextInputType.multiline,
                          maxLines: 4096,
                          style: const TextStyle(fontSize: 14),
                          decoration: InputDecoration(
                            hoverColor: Colors.white,
                            hintText: '请输入笔记正文',
                            hintStyle: const TextStyle(fontSize: 14),
                            contentPadding: const EdgeInsets.all(8),
                            filled: true,
                            fillColor: Colors.white,
                            border: OutlineInputBorder(
                              borderSide: const BorderSide(
                                  color: Color.fromRGBO(240, 240, 240, 100),
                                  width: 1,
                                  style: BorderStyle.solid),
                              borderRadius: BorderRadius.circular(4),
                            ),
                          ),
                          controller: bodyController,
                        ),
                      ),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                  fixedSize: const Size(80, 32)),
                              onPressed: () async {
                                saveArticle(context, false);
                              },
                              child: const Text(
                                "保存",
                                style: TextStyle(fontSize: 14, height: 1),
                              ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.all(8),
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                  fixedSize: const Size(80, 32)),
                              onPressed: () async {
                                saveArticle(context, true);
                              },
                              child: const Text(
                                "发布",
                                style: TextStyle(fontSize: 14, height: 1),
                              ),
                            ),
                          ),
                        ],
                      ),
                      if (errorMessage.isNotEmpty)
                        Container(
                            padding: const EdgeInsets.all(8),
                            child: Text(errorMessage,
                                style: const TextStyle(color: Colors.red)))
                    ]))
          ],
        ));
  }

  void saveArticle(BuildContext context, bool publish) async {
    if (titleController.text.isEmpty || bodyController.text.isEmpty) {
      return;
    }
    // var success =
    //     await postArticleCreate(titleController.text, bodyController.text);
    // if (success) {
    //   routerDelegate.go(WebRoutePath.articleReadPath);
    // }
  }
}

class LimitRangeTextInputFormatter extends TextInputFormatter {
  LimitRangeTextInputFormatter(this.min, this.max) : assert(min < max);

  final int min;
  final int max;

  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue oldValue, TextEditingValue newValue) {
    var value = int.parse(newValue.text);
    if (value < min) {
      return TextEditingValue(text: min.toString());
    } else if (value > max) {
      return TextEditingValue(text: max.toString());
    }
    return newValue;
  }
}
