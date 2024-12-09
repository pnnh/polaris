
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AppbarWidget extends ConsumerWidget implements PreferredSizeWidget {
  final double appbarHeight = 40.0;

  const AppbarWidget({super.key});

  @override
  Size get preferredSize => Size.fromHeight(appbarHeight);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      color: const Color(0xFFF5F5F5),
      height: appbarHeight,
      child: Row(
        children: [
          const SizedBox(width: 16,),
          const Text("Polaris"),
          const Spacer(),
          const SizedBox(width: 16,),
          const Text("xspanni@gmail.com"),
          const SizedBox(width: 16,),
        ]),
      );
  }
}