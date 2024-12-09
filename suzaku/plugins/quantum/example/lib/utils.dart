import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';

Future<String> getDatabaseFullPath() async {
  Directory appDocDir = await getApplicationDocumentsDirectory();
  String appDocPath = appDocDir.path;
  var homeDir = appDocPath;
  var fullPath = join(homeDir, "quantum_example.sqlite3");
  debugPrint("fullPath: $fullPath");
  return fullPath;
}
