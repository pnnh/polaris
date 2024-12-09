import 'dart:async';

import 'package:flutter/services.dart';

import 'database/database.dart';

const String _libName = 'quantum';

class Quantum {
  static const MethodChannel _channel = MethodChannel('quantum');

  static Future<String?> get platformVersion async {
    final String? version = await _channel.invokeMethod('getPlatformVersion');
    return version;
  }

  static void pluginSayHello() {
    QADatabase.instance.pluginSayHello();
  }
}
