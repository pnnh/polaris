import 'package:polaris/application/application.dart' as application;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_strategy/url_strategy.dart';


void main() async { 
  WidgetsFlutterBinding.ensureInitialized();
 
  setPathUrlStrategy();
  var app = await application.initApp();

  runApp(ProviderScope(child: app));
}
