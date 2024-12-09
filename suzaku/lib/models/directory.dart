class VSDirectoryModel {
  String pk;
  String title;
  String path;
  String parent ;

  VSDirectoryModel(this.pk, {required this.path,
    this.title = "测试目录",
  this.parent = ""});
}