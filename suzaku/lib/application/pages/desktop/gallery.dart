import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:polaris/application/components/empty.dart';
import 'package:polaris/models/picture.dart';
import 'package:polaris/services/picture.dart';
import 'package:split_view/split_view.dart';

import 'album.dart';

class VSGalleryWidget extends ConsumerWidget {
  const VSGalleryWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    var albumModel = ref.watch(albumModelProvider);
    if (albumModel == null) {
      return const VSEmptyWidget();
    }
    return FutureBuilder<List<PictureModel>>(
        future: selectPictures(albumModel),
        builder: ((context, snapshot) {
          var files = snapshot.data;
          if (files == null || files.isEmpty) {
            return const VSEmptyWidget();
          }

          return SplitView(
            viewMode: SplitViewMode.Horizontal,
            indicator: SplitIndicator(viewMode: SplitViewMode.Horizontal),
            activeIndicator: SplitIndicator(
              viewMode: SplitViewMode.Horizontal,
              isActive: true,
            ),
            controller: SplitViewController(weights: [0.5, 0.5], limits: [WeightLimit(min: 0.2, max: 0.5)]),
            children: [
              _FileListWidget(files),
              Container(
                child: const Text("图片预览"),
              )
            ],
            onWeightChanged: (w) => print("Horizon: $w"),
          );
        }));
  }
}

class _FileListWidget extends ConsumerWidget {
  final List<PictureModel> files;
  const _FileListWidget(this.files, {super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return LayoutBuilder(builder: (context, constraints) {
      debugPrint("constraints: $constraints");
      var columnCount = (constraints.maxWidth / 160).floor();
      if (columnCount < 1) {
        columnCount = 1;
      }
      return GridView.builder(
        shrinkWrap: true,
        itemCount: files.length,
        physics: const NeverScrollableScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 16),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: columnCount,
          mainAxisSpacing: 8,
          crossAxisSpacing: 8,
          childAspectRatio: 1,
        ),
        itemBuilder: (context, index) {
          return _PictureTileWidget(files[index]);
        },
      );
    });
  }
}

class _PictureTileWidget extends ConsumerWidget {
  final PictureModel picture;
  const _PictureTileWidget(this.picture, {super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFF9F9F9),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFFE0E0E0), width: 0.5),
      ),
      child: Image.file(File(picture.path)),
    );
  }
}
