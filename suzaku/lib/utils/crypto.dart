import 'dart:io';
import 'package:crypto/crypto.dart';

Future<String> generateChecksum(String filePath) async {
  final fileStream = File(filePath).openRead();
  final checksum = (await md5.bind(fileStream).first).toString();
  return checksum;
}