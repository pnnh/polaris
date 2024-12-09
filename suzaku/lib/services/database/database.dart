import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

Future getDatabase() async {
  var databasesPath = await getDatabasesPath();
  String dbPath = join(databasesPath, 'venus.db');

  var touchTableSql = '''
create table if not exists main.images
(
    pk   TEXT primary key,
    basename TEXT,
    path text not null
);
''';

  Database database = await openDatabase(dbPath, version: 1,
      onCreate: (Database db, int version) async {
        await db.execute(touchTableSql);
  });

  return database;

}

Future<dynamic> databaseInsert(String sqlText, List params) async {
  var database = await getDatabase();

  var result = await database.rawInsert(
      sqlText,
      params);
  return result;
}