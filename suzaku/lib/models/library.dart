class VSLibraryModel {
  String uid;
  String title;
  String path;
  int count = 0;

  VSLibraryModel(this.uid, {required this.path, this.title = "测试图集"});
}