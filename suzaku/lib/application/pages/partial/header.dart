import 'dart:math';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class HeaderWidget extends StatelessWidget {
  const HeaderWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
          color: Colors.white,
          border: Border(
              bottom: BorderSide(
            color: Color(0xffececec),
            width: 1,
          ))),
      child: Center(
        child: LayoutBuilder(
            builder: (BuildContext context, BoxConstraints constraints) {
          return ConstrainedBox(
            constraints:
                BoxConstraints.tightFor(width: min(1400, constraints.maxWidth)),
            child: Container(
                height: 64,
                padding: const EdgeInsets.only(left: 16, right: 16),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: [
                          Container(
                              padding: EdgeInsets.zero,
                              child: const Row(
                                children: [
                                  Image(
                                    height: 32,
                                    width: 32,
                                    image:
                                        AssetImage("bundle/images/brand.png"),
                                  ),
                                  SizedBox(
                                    width: 8,
                                  ),
                                  Text(
                                    "泛涵",
                                    style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.w500),
                                  )
                                ],
                              )),
                          const SizedBox(
                            width: 16,
                          ),
                          TextButton(
                            style: ButtonStyle(
                                splashFactory: NoSplash.splashFactory,
                                overlayColor: MaterialStateProperty.all(
                                    Colors.transparent)),
                            onPressed: () async {
                              context.go("/");
                            },
                            child: const Text(
                              "资源",
                              style: TextStyle(
                                  color: Colors.black,
                                  fontWeight: FontWeight.w500,
                                  fontSize: 16),
                            ),
                          ),
                          TextButton(
                            style: ButtonStyle(
                                splashFactory: NoSplash.splashFactory,
                                overlayColor: MaterialStateProperty.all(
                                    Colors.transparent)),
                            onPressed: () async {
                              context.go("/random");
                            },
                            child: const Text(
                              "程序",
                              style: TextStyle(
                                  color: Colors.black,
                                  fontWeight: FontWeight.w500,
                                  fontSize: 16),
                            ),
                          ),
                        ]),
                  ],
                )), // your column
          );
        }),
      ),
    );
  }
}
