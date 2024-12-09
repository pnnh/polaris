import 'dart:math';
import 'package:path/path.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:polaris/models/folder.dart';
import 'package:polaris/services/folder.dart';
import 'package:polaris/utils/logger.dart';

final StateProvider<String> _directoryProvider = StateProvider((_) => "");

class FoldersBody extends StatelessWidget {
  const FoldersBody({super.key});

  @override
  Widget build(BuildContext context) {
    return const _FoldersBodyState();
  }
}

class _FoldersBodyState extends ConsumerWidget {
  const _FoldersBodyState();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        Size screenSize = MediaQuery.of(context).size;
        logger.d("screenSize $screenSize");

        return ConstrainedBox(
          constraints:
              BoxConstraints.tightFor(height: max(512, constraints.maxHeight)),
          child: Container(
              color: Colors.white,
              child: Column(
                children: [
                  const _MFoldersPartial(),
                  Center(
                    child: TextButton(
                      onPressed: () async {
                        debugPrint("点击按钮");

                        var folder = await Folders.pickFolder();
                        if (folder != null) {
                          debugPrint("选择了文件夹: ${folder.path}");
                          ref
                              .read(_directoryProvider.notifier)
                              .update((state) => folder.path);
                        } else {
                          debugPrint("什么都没有选择");
                        }
                      },
                      child: const Text("点击"),
                    ),
                  )
                ],
              )), // your column
        );
      },
    );
  }
}

class _MFoldersPartial extends ConsumerWidget {
  const _MFoldersPartial();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return FutureBuilder<List<FolderModel>>(
        future: queryFolders(ref.watch(_directoryProvider)),
        builder: (BuildContext context, AsyncSnapshot snapshot) {
          if (!snapshot.hasData) {
            return const Center(
              child: Text("加载Folders出错"),
            );
          }
          var dataList = snapshot.data as List<FolderModel>;
          return Column(
            children: [
              Column(
                  children: List.generate(
                dataList.length,
                (index) {
                  var item = dataList[index];
                  debugPrint("item: ${item.path}");

                  return MouseRegion(
                      child: Container(
                    height: 32,
                    padding: const EdgeInsets.only(left: 16, right: 16),
                    color: Colors.transparent,
                    child: GestureDetector(
                        behavior: HitTestBehavior.translucent,
                        onTap: () {
                          debugPrint("点击动图");
                          context.go("/pictures/${item.pk}");
                        },
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.only(
                                      left: 0, right: 8, top: 0, bottom: 0),
                                  child: SvgPicture.asset(
                                    "bundle/images/icons/folder.svg",
                                    color: const Color(0xff444444),
                                    height: 16,
                                    width: 16,
                                    //    fit: BoxFit.fitWidth
                                  ),
                                ),
                                Text(
                                  basename(item.path),
                                  style: const TextStyle(fontSize: 12),
                                ),
                              ],
                            ),
                            Text(item.count.toString())
                          ],
                        )),
                  ));
                },
              ))
            ],
          );
        });
  }
}
