import 'package:polaris/models/authorization.dart';
import 'package:hive_flutter/hive_flutter.dart';

class HiveStore {
  static const String store = "store";

  static Future<void> init() async {
    // Directory current = Directory.current;
    // debugPrint('current: ${current.path}');
    await Hive.initFlutter(store);
    //Hive.registerAdapter(TaskAdapter());
    Hive.registerAdapter(AuthorizationModelAdapter());
  }

  static Future<V?> get<K, V>(K key) async {
    var box = await Hive.openBox<V>(store);

    return box.get(key);
  }

  static Future<void> put<K, V>(K key, V value) async {
    var box = await Hive.openBox<V>(store);
    return box.put(key, value);
  }

  static Future<Iterable<V>> query<V>() async {
    var box = await Hive.openBox<V>(store);
    return box.values;
  }
}
