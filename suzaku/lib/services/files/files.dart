import 'dart:io';

import 'package:flutter/cupertino.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:uuid/uuid.dart';

Future<String> saveImage(String cacheFile) async {
  Directory appDocDir = await getApplicationDocumentsDirectory();
  String appDocPath = appDocDir.path;
  var homeDir = join(appDocPath, "images");

  await touchDirectory(homeDir);
  var uuid = const Uuid();
  var fileName = uuid.v4();
  var extName = extension(cacheFile);
  fileName = "$fileName$extName";
  var fullPath = join(homeDir, fileName);
  debugPrint("fullPath2: $fullPath");
  var srcFile = File(cacheFile);
  var destFile = File(fullPath);
  if (destFile.existsSync()) {
    return fullPath;
  }
  await srcFile.copy(fullPath);
  return fullPath;
}

Future touchDirectory(String path) async {
  var dir = Directory(path);
  var isExists = await dir.exists();
  if (!isExists) {
    await dir.create(recursive: true);
  }
}