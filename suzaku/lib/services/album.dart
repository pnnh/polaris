import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:polaris/models/album.dart';
import 'package:polaris/models/library.dart';

Future<List<VSAlbumModel>> selectAlbums(VSLibraryModel libraryModel) async {
  var list = <VSAlbumModel>[];

  var dir = Directory(libraryModel.path);
  var lists = dir.listSync();
  for (var item in lists) {
    var albumExt = ".vsalbum";
    if (item is Directory && item.path.endsWith(albumExt)) {
      var filename = basename(item.path);
      var title = filename.substring(0, filename.length - albumExt.length);
      list.add(VSAlbumModel(filename, path: item.path, title: title));
    }
  }

  return list;
}
