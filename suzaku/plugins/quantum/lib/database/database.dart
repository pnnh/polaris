import 'dart:ffi' as ffi;
import 'dart:ffi';
import 'dart:io' show Platform, Directory;
import 'dart:io';

import 'package:ffi/ffi.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:quantum/generated_bindings.dart';

typedef HelloWorldFunc = ffi.Void Function();
typedef HelloWorld = void Function();

class QADatabase {
  static final QADatabase instance = QADatabase('quantum_native');

  late final ffi.DynamicLibrary _dylib;
  late final HelloWorld _helloWorld;
  late final NativeLibrary _quantumNative;

  QADatabase(String libName) {
    _dylib = _openNativeLibrary(libName);
    _helloWorld = _dylib
        .lookup<ffi.NativeFunction<HelloWorldFunc>>('hello_world')
        .asFunction();
    _quantumNative = NativeLibrary(_dylib);
  }

  DynamicLibrary _openNativeLibrary(String libName) {
    debugPrint("current dir: ${Directory.current}");
    if (Platform.isMacOS || Platform.isIOS) {
      return DynamicLibrary.process();
    }
    if (Platform.isAndroid || Platform.isLinux) {
      return DynamicLibrary.open('lib$libName.so');
    }
    if (Platform.isWindows) {
      return DynamicLibrary.open('$libName.dll');
    }
    throw UnsupportedError('Unknown platform: ${Platform.operatingSystem}');
  }

  void pluginSayHello() {
    _helloWorld();

    // 尝试调用sum，传递和返回int参数
    print('3 + 5 = ${_quantumNative.sum(3, 5)}');

    // 尝试调用subtract，传递指针
    final p = calloc<Int>();
    p.value = 3;
    print('3 - 5 = ${_quantumNative.subtract(p, 5)}');
    calloc.free(p); // 释放dart端分配的内存

    // 尝试调用multiply，返回指针
    final resultPointer = _quantumNative.multiply(3, 5);
    final int result = resultPointer.value;
    print('3 * 5 = $result');
    _quantumNative.free_pointer(resultPointer); // 释放native端分配的内存
  }
}
