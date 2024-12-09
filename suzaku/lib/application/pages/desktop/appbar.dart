

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class VSAppBar extends ConsumerWidget implements PreferredSizeWidget {
  final double appbarHeight = 40.0;

  const VSAppBar({super.key});

  @override
  Size get preferredSize => Size.fromHeight(appbarHeight);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      color: const Color(0xFFF5F5F5),
      height: appbarHeight,
      child: const Row(
        children: [
          SizedBox(width: 16,),
          Text("Venus"),
          Spacer(),
          SizedBox(width: 16,),
          Text("xspanni@gmail.com"),
          SizedBox(width: 16,),
        ]),
      );
  }
}