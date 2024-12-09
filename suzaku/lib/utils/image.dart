import 'package:mime/mime.dart';

bool isImage(String path) {
  final mimeType = lookupMimeType(path);
  if (mimeType == null) return false;

  return mimeType.startsWith('image/');
}
