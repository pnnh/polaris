import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/svg.dart';
import 'package:path/path.dart';
import 'package:polaris/application/providers/emotion.dart';
import 'package:polaris/models/folder.dart';
import 'package:polaris/services/folder.dart';

import '../../../utils/random.dart';

final StateProvider<String> directoryProvider = StateProvider((_) => "");

class VFoldersWidget extends ConsumerWidget {
  const VFoldersWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return FutureBuilder<List<FolderModel>>(
        future: queryFolders(ref.watch(directoryProvider)),
        builder: (BuildContext context, AsyncSnapshot snapshot) {
          List<FolderModel> dataList = List.empty();
          if (snapshot.error != null) {
            return const Center(
              child: Text("加载Folders出错"),
            );
          }
          if (snapshot.hasData) {
            dataList = snapshot.data as List<FolderModel>;
          }
          return Column(
            children: [
              Container(
                height: 32,
                padding: const EdgeInsets.only(left: 16, right: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      "位置",
                      style: TextStyle(fontSize: 14),
                    ),
                    GestureDetector(
                      onTap: () async {
                        debugPrint("plus");
                        var folder = await pickFolder();
                        if (folder != null) {
                          ref.read(directoryProvider.notifier)
                              .update((state) => folder.path);
                        }
                      },
                      child: SvgPicture.asset(
                        "bundle/images/icons/plus.svg",
                        color: const Color(0xffCDCDCD),
                        height: 16,
                        width: 16,
                        //    fit: BoxFit.fitWidth
                      ),
                    )
                  ],
                ),
              ),
              const SizedBox(
                height: 8,
              ),
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
                            color: ref
                                .watch(folderProvider)
                                .pk == item.pk
                                ? const Color(0xffD3D3D3)
                                : Colors.transparent,
                            child: GestureDetector(
                                behavior: HitTestBehavior.translucent,
                                onTap: () {
                                  debugPrint("点击动图");
                                  ref
                                      .read(folderProvider.notifier)
                                      .update((state) => item);
                                },
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment
                                      .spaceBetween,
                                  children: [
                                    Row(
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.only(
                                              left: 0,
                                              right: 8,
                                              top: 0,
                                              bottom: 0),
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

  Future<FolderModel?> pickFolder() async {
    String? selectedDirectory = await FilePicker.platform.getDirectoryPath();

    if (selectedDirectory != null) {
      debugPrint("selectedDirectory: $selectedDirectory");

      var pk = generateRandomString(16);
      var newFolder = FolderModel(pk,
          path: selectedDirectory);
      await insertFolder(newFolder);

      return newFolder;
    }

    return null;
  }
}
