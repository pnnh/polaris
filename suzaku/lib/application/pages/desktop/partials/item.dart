import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
import 'package:polaris/models/article.dart';

class TodoItemWidget extends StatefulWidget {
  final ArticleModel article;

  const TodoItemWidget({super.key, required this.article });

  @override
  State<TodoItemWidget> createState() => _TodoItemWidget();
}

class _TodoItemWidget extends State<TodoItemWidget> {
  final Color hoveredColor = const Color.fromRGBO(248, 249, 255, 100);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        context.goNamed('articleRead', pathParameters: {'pk': widget.article.uid});
      },
      child: Text(
          widget.article.title
      ),
    );
  }
}
