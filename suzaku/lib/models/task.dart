
class Article {
  String key;
  String title;
  String body;
  DateTime time;

  Article(this.key, this.title, this.body, this.time);

  @override
  String toString() => title;
}
