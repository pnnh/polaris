
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final StateProvider<int> _activeItem = StateProvider((_) => 0);

class PartitionWidget extends ConsumerWidget {

  const PartitionWidget({super.key});


  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      color: const Color(0xFFF9F9F9),
      width: 200,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 40,
              color: Color(0xFFF2F2F2),
              child: Row(
                children: [
                  SizedBox(width: 16,),
                  Text("Dotnet"),
                  Image(image: AssetImage('bundle/images/console/down-arrow.png'))
                ],
              ),
            ),
            Expanded(child: Container(
              width: double.infinity,
              padding: EdgeInsets.zero,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _ItemWidget(1, "工作台"),
                  _ItemWidget(2, "项目管理"),
                  _ItemWidget(3, "任务管理"),
                  _ItemWidget(4, "日程管理"),
                  _ItemWidget(5, "文档管理"),
                ],
              ),
            )
            )

          ]),
    );
  }
}

class _ItemWidget extends ConsumerWidget {
  final int id;
  final String title;
  const _ItemWidget(this.id, this.title, {super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return  MouseRegion(
       child:  Container(
         padding: EdgeInsets.only(left: 16, right: 16, top: 8, bottom: 8),
          width: double.infinity,
          color: ref.watch(_activeItem) == this.id ? Color(0xFFF2F2F2) : Colors.transparent,
          child: Text("工作台"),
        ),
      onEnter: (event) { ref.read(_activeItem.notifier).update((state) => this.id);},
      onExit: (event) { ref.read(_activeItem.notifier).update((state) => 0);},
    )
   ;
  }
}