
import 'package:flutter/material.dart';
import 'package:polaris/application/pages/partial/toolbar.dart';

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
                                  Text(
                                    "返回",
                                    style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.w500),
                                  )
                                ],
                              )),
                        ]),
                    const ToolbarWidget()
                  ],
                ))
    );
  }
}
