
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';

class EFuncGroupWidget extends ConsumerWidget {
  const EFuncGroupWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
        width: 48,
        color: const Color(0xffF2F2F2),
        padding: const EdgeInsets.only(top: 24, left: 0, bottom: 24, right: 0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(children: [
              SvgPicture.asset(
                "bundle/images/icons/book.svg",
                color: const Color(0xff000000),
                height: 20,
                width: 20,
              ),
              const SizedBox(
                height: 16,
              ),
              SvgPicture.asset(
                "bundle/images/icons/box.svg",
                color: const Color(0xff000000),
              )
            ]),
            Column(children: [
              SvgPicture.asset(
                "bundle/images/icons/user.svg",
                color: const Color(0xff000000),
              ),
              const SizedBox(
                height: 16,
              ),
              SvgPicture.asset(
                "bundle/images/icons/setting.svg",
                color: const Color(0xff000000),
              )
            ]),
          ],
        ));
  }
}
