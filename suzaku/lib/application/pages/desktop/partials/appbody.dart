
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'notes.dart';
import 'partition.dart';

import 'navbar.dart';

class AppBodyWidget extends ConsumerWidget {
  const AppBodyWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      color: const Color(0xFFFFFFFF),
      child: Row(
          children: [
            NavbarWidget(),
            PartitionWidget(),
            NotesWidget(),
            // DetailsWidget()
          ]),
    );
  }
}