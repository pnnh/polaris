
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class NotFoundWidget extends StatelessWidget {
  const NotFoundWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(children: [
        const Text("资源不存在"),
        TextButton(
          style: ButtonStyle(
              splashFactory: NoSplash.splashFactory,
              overlayColor: MaterialStateProperty.all(Colors.transparent)),
          onPressed: () async {
            context.go("/");
          },
          child: const Text(
            "返回首页",
          ),
        )
      ]),
    );
  }
}
 