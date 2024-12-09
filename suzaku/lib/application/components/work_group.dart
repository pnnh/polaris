
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:go_router/go_router.dart';

import 'avatar.dart';

class WorkGroupWidget extends StatefulWidget {
  const WorkGroupWidget({super.key});

  @override
  State<WorkGroupWidget> createState() => _WorkGroupWidget();
}

class _WorkGroupWidget extends State<WorkGroupWidget> {
  final Color selectedColor = const Color.fromRGBO(0, 119, 212, 100);
  final Color defaultColor = const Color.fromRGBO(146, 148, 152, 100);

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      const AvatarWidget(),
      const SizedBox(height: 24),
      IconButton(
          icon: SvgPicture.asset(
            "bundle/images/icons/todo.svg",
            color: defaultColor,
          ),
          iconSize: 24,
          onPressed: () {
            context.go("/");
          }),
      const SizedBox(height: 24),
      IconButton(
          icon: SvgPicture.asset(
            "bundle/images/icons/booklet.svg",
            color: defaultColor,
          ),
          iconSize: 24,
          onPressed: () {
            context.go("/calendar");
          }),
      const SizedBox(height: 24),
      IconButton(
          icon: SvgPicture.asset(
            "bundle/images/icons/todo.svg",
            color: defaultColor,
          ),
          iconSize: 24,
          onPressed: () {
            context.go("/other");
          }),
    ]);
  }
}
