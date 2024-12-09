import 'dart:io';

import 'package:flutter_riverpod/flutter_riverpod.dart';

final emotionProvider =
    StateNotifierProvider<EmotionModel, String>((ref) => EmotionModel());

class EmotionPicture {
  String path = "";

  EmotionPicture(this.path);
}

class EmotionModel extends StateNotifier<String> {
  EmotionModel() : super("");

  void selectKey(String key) { 
    state = key;
  }
}

Future<List<EmotionPicture>> selectPics(String picPath) async { 
  if (picPath.trim().isEmpty) {
    return List.empty();
  }
  final dir = Directory(picPath);
  List<EmotionPicture> files = <EmotionPicture>[];
  await for (FileSystemEntity entity
      in dir.list(recursive: false, followLinks: false)) {
    FileSystemEntityType type = await FileSystemEntity.type(entity.path);
    if (type == FileSystemEntityType.file) {
      var pic = EmotionPicture(entity.path);
      files.add(pic);
    }
  }
  return files;
}
