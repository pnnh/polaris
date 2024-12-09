import 'dart:io' show Platform;

import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:polaris/application/pages/desktop/home.dart';

import 'pages/desktop/pictures/pictures.dart';
import 'pages/mobile/home.dart';
import 'pages/mobile/share/receive.dart';
import 'pages/mobile/share/share.dart';
import 'pages/web/article/read.dart';
import 'pages/web/home.dart';

final GoRouter globalRouter = GoRouter(
  routes: <RouteBase>[
    GoRoute(
      path: '/',
      builder: (BuildContext context, GoRouterState state) {
        if (kIsWeb) {
          return const WHomePage();
        }

        if (Platform.isMacOS ||
            Platform.isLinux ||
            Platform.isWindows ||
            Platform.isFuchsia) {
          return const DHomePage();
        }
        if (Platform.isAndroid || Platform.isIOS) {
          return const MHomePage();
        }

        throw UnsupportedError('Unknown platform: ${Platform.operatingSystem}');
      },
      routes: <RouteBase>[
        GoRoute(
          path: 'article/:pk',
          builder: (BuildContext context, GoRouterState state) {
            return WArticleReadPage(state.pathParameters);
          },
        ),
        GoRoute(
          path: 'pictures/:pk',
          builder: (BuildContext context, GoRouterState state) {
            return PicturesPage(folderPk: state.pathParameters['pk'] as String);
          },
        ),
        GoRoute(
          path: 'mobile/share',
          builder: (BuildContext context, GoRouterState state) {
            return const ShareSendPage();
          },
        ),
        GoRoute(
          path: 'mobile/receive',
          builder: (BuildContext context, GoRouterState state) {
            return const ShareReceivePage();
          },
        ),
      ],
    ),
  ],
);
