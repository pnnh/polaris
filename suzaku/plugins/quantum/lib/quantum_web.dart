import 'dart:async';
import 'dart:html';
import 'package:flutter/services.dart';
import 'package:flutter_web_plugins/flutter_web_plugins.dart';

class QuantumWeb {
  static void registerWith(Registrar registrar) {
    final MethodChannel channel = MethodChannel(
      'quantum',
      const StandardMethodCodec(),
      registrar,
    );

    final pluginInstance = QuantumWeb();
    channel.setMethodCallHandler(pluginInstance.handleMethodCall);
  }

  Future<dynamic> handleMethodCall(MethodCall call) async {
    switch (call.method) {
      case 'getPlatformVersion':
        return getPlatformVersion();
      default:
        throw PlatformException(
          code: 'Unimplemented',
          details: 'quantum for web doesn\'t implement \'${call.method}\'',
        );
    }
  }

  Future<String> getPlatformVersion() {
    final version = window.navigator.userAgent;
    return Future.value(version);
  }
}
