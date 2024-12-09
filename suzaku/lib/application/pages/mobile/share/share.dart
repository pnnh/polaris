
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class ShareSendPage extends StatelessWidget {
  const ShareSendPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const _ShareSendPageState();
  }
}

class _ShareSendPageState extends ConsumerWidget {
  const _ShareSendPageState();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return const Scaffold(
      body: SafeArea(
        child: Center(
          child: Text("文件分享页面"),
        ),
      ),
    );
  }
}
