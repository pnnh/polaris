
class NoteModel {
  String pk = "";
  String title = "";
  String description = "";
  String mime = "";
  String body = "";
  DateTime createTime = DateTime.utc(0);
  DateTime updateTime = DateTime.utc(0);
  String cover = "";

  NoteModel(
      {this.pk = "", this.title = "", this.body = ""});
}
