import 'dart:io';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:polaris/models/folder.dart';


final StateProvider<FolderModel> folderProvider = StateProvider((_) => FolderModel("", path: ""));

final StateProvider<String> gridProvider = StateProvider((_) => "");



final weEmotionProvider =
    StateNotifierProvider<EmotionNotifier, String>((ref) => EmotionNotifier());

final wpEmotionHoverProvider = StateNotifierProvider((ref) {
  return Hover();
});

class Hover extends StateNotifier<String> {
  Hover() : super("");

  void setKey(String key) {
    state = key;
  }
}

final wpGridProvider =
    StateNotifierProvider<GridNotifier, GridState>((ref) => GridNotifier());

class EmotionPicture {
  String path = "";

  EmotionPicture(this.path);
}

class EmotionNotifier extends StateNotifier<String> {
  EmotionNotifier() : super("");

  void select(String key) { 
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

class GridState {
  String selectedKey = "";
  String hoverKey = "";

  GridState(this.selectedKey, this.hoverKey);

  bool hoverOrSelected(String pk) {
    return selectedKey == pk || hoverKey == pk;
  }
}

class GridNotifier extends StateNotifier<GridState> {
  GridNotifier() : super(GridState("", ""));

  void select(String key) { 
    state = GridState(key, state.hoverKey);
  }

  void hover(String key) { 
    state = GridState(state.selectedKey, key);
  }
}
