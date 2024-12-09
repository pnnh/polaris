
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';


class DBHelper {
  Database? _database;

  static final DBHelper instance = DBHelper._internal();

  factory DBHelper() {
    return instance;
  }

  DBHelper._internal();

  Future<Database> _openDatabase() async {
    if (_database != null) {
      return _database!;
    }
    const databaseName = 'venus.db3';
    // Directory appDocDir = await getApplicationDocumentsDirectory();
    //
    // String appDocPath = appDocDir.path;
    // var homeDir = appDocPath;
    // var dataDir = join(homeDir, "databases");
    // await touchDirectory(dataDir);
    // var fullPath = join(dataDir, databaseName);
    // debugPrint("fullPath: $fullPath");

    var databasesPath = await getDatabasesPath();
    String fullPath = join(databasesPath, databaseName);

    final db = await openDatabase(fullPath);

    _database = db;
    return _database!;
  }

  Future<void> executeAsync(String sql,
      [List<Object?> parameters = const []]) async {
    var database = await _openDatabase();
    database.execute(sql, parameters);
  }

  Future<List<Map<String, Object?>>> selectAsync(String sql,
      [List<Object?> parameters = const []]) async {
    var database = await _openDatabase();
    return database.rawQuery(sql, parameters);
  }

  Future<void> transactionAsync(Map<String, List<Object?>> commands) async {
    var database = await _openDatabase();
    await database.transaction((txn) async {
      for (var command in commands.entries) {
        await txn.execute(command.key, command.value);
      }
    });
  }
}