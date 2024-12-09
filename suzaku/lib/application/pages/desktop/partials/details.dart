
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class DetailsWidget extends ConsumerWidget {

  const DetailsWidget({super.key});


  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      color: const Color(0xFFF5F5F5),
      child:  Center(
        child: Text("正文"),
      ),
    );
  }
}