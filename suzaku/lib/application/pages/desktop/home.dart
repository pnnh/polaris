import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:polaris/application/pages/desktop/appbar.dart';

import 'appbody.dart';
import 'partials/appbar.dart';
import 'partials/appbody.dart';

class DHomePage extends ConsumerWidget {
  const DHomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {

    return const Scaffold(
      appBar: VSAppBar(),
      body: SafeArea(
        child: VSAppBodyWidget(),
      ),
    );
  }
}

// 旧的polaris桌面首页
class DOldHomePage extends StatelessWidget {
  const DOldHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      appBar: AppbarWidget(),
      body: SafeArea(
        child: AppBodyWidget(),
      ),
    );
  }
}
