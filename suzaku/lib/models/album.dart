class VSAlbumModel {
  String pk;
  String title;
  String path;
  int count = 0;

  VSAlbumModel(this.pk, {required this.path, this.title = "测试图集"});
}