
import 'package:flutter/cupertino.dart';
import 'package:image_picker/image_picker.dart';
import 'package:uuid/uuid.dart';

import '../database/image.dart';
import '../files/files.dart';
import '../../../models/picture.dart';

Future pickImage() async {
  final ImagePicker picker = ImagePicker();
// Pick an image.
//   final XFile? image = await picker.pickImage(source: ImageSource.gallery);
// Capture a photo.
//   final XFile? photo = await picker.pickImage(source: ImageSource.camera);
// Pick a video.
//   final XFile? galleryVideo =
  // await picker.pickVideo(source: ImageSource.gallery);
// Capture a video.
//   final XFile? cameraVideo = await picker.pickVideo(source: ImageSource.camera);
// Pick multiple images.
  final List<XFile> images = await picker.pickMultiImage();
  for(var image in images) {
    debugPrint("选择到照片: ${image.path}");
    var fullPath = await saveImage(image.path);
    var uuid = const Uuid();
    var model = PictureModel(uuid.v4(), "", fullPath);
    await insertImage(model);
  }
// Pick singe image or video.
//   final XFile? media = await picker.pickMedia();
// Pick multiple images and videos.
//   final List<XFile> medias = await picker.pickMultipleMedia();
}