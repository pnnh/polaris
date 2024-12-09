
@JS()
library quantum_js; //Not avoid the library annotation

import 'dart:html';

import 'package:js/js.dart';

import 'dart:js' as js;
import 'dart:js_util';

@JS('console.log') // annotates `log` function to call `console.log`
external void log(dynamic str);

@JS()
external sayHello();

@JS()
external Future<String> getFontData(String fontName);

@JS()
external Future<Blob> getFontData2(String fontName);