
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';

class ShareReceivePage extends StatelessWidget {
  const ShareReceivePage({super.key});

  @override
  Widget build(BuildContext context) {
    return const _ShareReceivePageState();
  }
}

class _ShareReceivePageState extends ConsumerWidget {
  const _ShareReceivePageState();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      // appBar: AppBar(
      //   title: const Text("Venus"),
      // ),
      body: SafeArea(
          child: Container(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Expanded(child:

                GridView.builder(
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                    ),
                    //itemCount: receivedList.length,
                    itemBuilder: (BuildContext context, int index) {

                      // var filePath = receivedList[index].value;
                      return buildImageCard(context, "");
                    }
                )),
                const SizedBox(height: 16,),
                Center(
                    child: Row(
                      children: [
                        ElevatedButton(
                          onPressed: () async {
                            //await savePictures(receivedList);
                            context.pop();
                          },
                          child: const Text("导入"),
                        ),
                        const SizedBox(width: 8,),
                        ElevatedButton(
                          onPressed: () async {
                            context.pop();
                            //exit(0);
                            //await SystemChannels.platform.invokeMethod('SystemNavigator.pop');
                            // if (Platform.isIOS) {
                            //   exit(0);
                            // } else {
                            //   SystemNavigator.pop();
                            // }
                          },
                          child: const Text("取消"),
                        ),
                      ],
                    )
                ),
                Center(
                  child: Container(
                      margin: const EdgeInsets.symmetric(horizontal: 24),
                      child: const Text('Sharing data')),
                )
              ],
            ),
          )
      ),
    );
  }
}

Widget buildImageCard(BuildContext context, String? filePath) {
  Widget imageWidget;
  if (filePath == null) {
    imageWidget = Image.asset('bundle/images/brand.png');
  } else {

  var file = File(filePath);
  imageWidget = Image.file(file, fit: BoxFit.cover,);
}
  return Container(
    margin: const EdgeInsets.all(16),
    decoration: BoxDecoration(
      borderRadius: const BorderRadius.all(
        Radius.circular(8),
      ),
      color: Theme.of(context).cardColor,
    ),
    child: ClipRRect(//是ClipRRect，不是ClipRect
      borderRadius: BorderRadius.circular(8),
      child: imageWidget,
    ),
  );
}

Future savePictures(List<String> receivedList) async {
  Directory appDocDir = await getApplicationDocumentsDirectory();
  String appDocPath = appDocDir.path;
  var homeDir = appDocPath;
  debugPrint("fullPath: $homeDir");

  var imagePath = join(homeDir, "images");
  var dir = Directory(imagePath);
  if (!dir.existsSync()) {
    dir.createSync();
  }

  for (var o in receivedList) {
    var filePath = o;
    if (filePath == "") {
      continue;
    }
    var file = File(filePath);
    var fileName = file.path.split("/").last;
    var fullPath = join(imagePath, fileName);
    file.copy(fullPath);
  }

}