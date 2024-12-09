
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class NavbarWidget extends ConsumerWidget {

  const NavbarWidget({super.key});


  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      color: const Color(0xFFF2F2F2),
      width: 56,
      child: Column(
          children: [
            SizedBox(height: 16,),
            Container(
              child: Image(image: AssetImage('bundle/images/console/file-copy-line.png'),
              fit: BoxFit.cover),
            ),
          ]),
    );
  }
}