
import 'package:polaris/application/pages/partial/page_loading.dart';
import 'package:polaris/models/article.dart';
import 'package:polaris/services/articles.dart';

import 'item.dart';
import 'package:flutter/material.dart';
import 'package:split_view/split_view.dart';

class TodoListWidget extends StatefulWidget {
  const TodoListWidget({super.key});

  @override
  State<TodoListWidget> createState() => _TodoListWidget();
}

class _TodoListWidget extends State<TodoListWidget> {
  final Color selectedColor = const Color.fromRGBO(238, 243, 254, 100);
  final Color defaultColor = Colors.white;
  final Color iconColor = const Color.fromRGBO(153, 153, 153, 100);
  final contentController = TextEditingController(text: "啊啊啊啊啊啊");
  FocusNode myFocusNode = FocusNode();

  @override
  Widget build(BuildContext context) {
    return Expanded(
        child: SplitView(
      viewMode: SplitViewMode.Horizontal,
      indicator: const SplitIndicator(viewMode: SplitViewMode.Horizontal),
      gripSize: 2,
      gripColor: const Color(0XFFEEEEEE),
      gripColorActive: const Color(0XFFEEEEEE),
      activeIndicator: const SplitIndicator(
        viewMode: SplitViewMode.Horizontal,
        isActive: true,
      ),
      controller: SplitViewController(
          limits: [WeightLimit(min: 0.2, max: 0.5), WeightLimit(min: 0.1)]),
      onWeightChanged: (w) => debugPrint("Horizontal $w"),
      children: [
        FutureBuilder<List<ArticleModel>>(
        future: ArticleService().selectArticles(),
        builder:
            (BuildContext context, AsyncSnapshot<List<ArticleModel>> snapshot) {
              if (snapshot.hasError) {
                return Text("加载出错1 ${snapshot.error}");
              }

              if (!snapshot.hasData) {
                return const PageLoadingWidget();
              }
              var items = snapshot.data;
              if (items == null) {

                return const Center(
                  child: Text("列表为空"),
                );
              }

              return  Container(
                  padding: const EdgeInsets.all(16),
                  decoration: const BoxDecoration(
                      border: Border(
                          right: BorderSide(
                            color: Color.fromRGBO(229, 229, 229, 100),
                            width: 1,
                          ))),
                  child: Column(
                    children: [
                      const SizedBox(height: 16),
                      Expanded(
                          child: ListView.builder(
                            itemCount: items.length,
                            itemBuilder: (context, index) {
                              if (items.length <= index) {
                                throw Exception("找不到item");
                              }
                              var model = items[index];
                              return TodoItemWidget(
                                article: model,
                              );
                            },
                          ))
                    ],
                  ));
            }
            )







      ],
    ));
  }

  @override
  void dispose() {
    super.dispose();
    myFocusNode.dispose();
  }
}
