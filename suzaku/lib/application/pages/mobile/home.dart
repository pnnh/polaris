import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'dart:async';

import 'package:polaris/application/pages/desktop/folders.dart';
import 'package:polaris/application/pages/common/tools.dart';
import 'package:polaris/models/picture.dart';
import 'package:polaris/services/image/image.dart';
import 'package:polaris/services/picture.dart';
import 'package:polaris/utils/logger.dart';

class MHomePage extends ConsumerStatefulWidget {
  const MHomePage({super.key});

  @override
  HomePageState createState() => HomePageState();
}

class HomePageState extends ConsumerState<MHomePage> {
  late StreamSubscription _intentDataStreamSubscription;
  //List<SharedFile>? list;
  int _selectedIndex = 0;
  static const List<Widget> _widgetOptions = <Widget>[
    HomeBody(),
    FoldersBody(),
    ToolsBody()
  ];

  @override
  void initState() {
    super.initState();
    // _intentDataStreamSubscription = FlutterSharingIntent.instance.getMediaStream()
    //     .listen((List<SharedFile> value) {
    //
    //   ref.read(shareReceiveProvider.notifier)
    //       .update((state) => value);
    //
    //   if (value.isNotEmpty) {
    //     logger.d("有分享的文件");
    //     context.go("/receive");
    //   }
    //   print("Shared: getMediaStream ${value.map((f) => f.value).join(",")}");
    // }, onError: (err) {
    //   print("getIntentDataStream error: $err");
    // });

    // For sharing images coming from outside the app while the app is closed
    // FlutterSharingIntent.instance.getInitialSharing().then((List<SharedFile> value) {
    //   print("Shared: getInitialMedia ${value.map((f) => f.value).join(",")}");
    //
    //   ref.read(shareReceiveProvider.notifier)
    //       .update((state) => value);
    //
    //   if (value.isNotEmpty) {
    //     logger.d("有分享的文件");
    //     context.go("/receive");
    //   }
    // });
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Venus"),
      ),
      body: SafeArea(
        child: _widgetOptions.elementAt(_selectedIndex),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: '照片',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.business),
            label: '相册',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.school),
            label: '工具',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.amber[800],
        onTap: _onItemTapped,
      ),
    );
  }
  @override
  void dispose() {
    _intentDataStreamSubscription.cancel();
    super.dispose();
  }

  void _onItemTapped(int index) {
    logger.d("点击了底部导航栏 $index");
    setState(() {
      _selectedIndex = index;
    });
  }
}

class HomeBody extends StatelessWidget {
  const HomeBody({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          color: Theme.of(context).secondaryHeaderColor,
          child: Row(
            children: [
              TextButton(onPressed: () async {
                debugPrint("点击导入图片");
                await requestPermission();
                await pickImage();
              }, child: const Text("导入图片"),)
            ],
          ),
        ),
        const SizedBox(height: 16,),
        Expanded(child: FutureBuilder(
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                var imageList = snapshot.data as List<PictureModel>;
                return GridView.builder(
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                    ),
                    itemCount: imageList.length,
                    itemBuilder: (BuildContext context, int index) {

                      var fileInfo = imageList[index];
                      return buildImageCard(context, fileInfo.path);
                    }
                );


                return const Center(
                  child: Text("已获取到权限"),
                );
              } else {
                return const Center(
                  child: CircularProgressIndicator(),
                );
              }
            },
            future: selectImages()))
      ],
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