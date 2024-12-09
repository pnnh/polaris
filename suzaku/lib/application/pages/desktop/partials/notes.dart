
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:polaris/models/note.dart';

final StateProvider<String> _activeItem = StateProvider((_) => "");

class NotesWidget extends ConsumerWidget {
  const NotesWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      width: 256,
      color: const Color(0xFFFAFAFA),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _NoteCard(NoteModel(pk: "a")),
          _NoteCard(NoteModel(pk: "b")),
          _NoteCard(NoteModel(pk: "c")),
        ],
      ),
    );
  }
}

class _NoteCard extends ConsumerWidget {
  final NoteModel noteModel;
  const _NoteCard(this.noteModel, {super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MouseRegion(
      child: Container(
        padding: EdgeInsets.only(left: 16, right: 16, top: 8, bottom: 8),
        width: double.infinity,
        color: ref.watch(_activeItem) == this.noteModel.pk ? Color(0xFFF2F2F2) : Colors.transparent,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("我没有解决它的解决方案", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),),
            SizedBox(height: 8,),
            Text("我的建议是，随着新的更新，Mac上的应用程序策略发生了一些变化。在此之前，开发人员对应用程序的签名不是那么必要，现在是。",
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.normal),),
            SizedBox(height: 8,),
            Text("2024-02-22 18:22:12", style: TextStyle(color: Color(0xFF999999),fontSize: 14, fontWeight: FontWeight.w400),)
          ],
        ),
      ),
      onEnter: (event) { ref.read(_activeItem.notifier).update((state) => this.noteModel.pk);},
      onExit: (event) { ref.read(_activeItem.notifier).update((state) => "");},
    ) ;
  }
}