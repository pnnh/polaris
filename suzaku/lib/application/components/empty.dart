import 'package:flutter/material.dart';

class VSEmptyWidget extends StatefulWidget {
  final String message;

  const VSEmptyWidget({super.key, this.message = ""});

  @override
  State<VSEmptyWidget> createState() => _EmptyWidget();
}

class _EmptyWidget extends State<VSEmptyWidget> {
  @override
  Widget build(BuildContext context) {
    return Center(
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
      const Image(image: AssetImage('bundle/images/placeholder/empty.png')),
      Text(
        widget.message,
        style: const TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      )
    ]));
  }
}
