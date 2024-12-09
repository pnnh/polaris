
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/flutter_svg.dart';

class VFiltersWidget extends ConsumerWidget {
  const VFiltersWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    var selectedKey = "";
    return Column(children: [
      Container(
        height: 32,
        padding: const EdgeInsets.only(left: 16, right: 16),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              "筛选",
              style: TextStyle(fontSize: 14),
            ),
          ],
        ),
      ),
      Container(
        height: 32,
        padding: const EdgeInsets.only(left: 16, right: 16),
        color:
            selectedKey == "bigimg" ? const Color(0xffD3D3D3) : Colors.transparent,
        child: MouseRegion(
            onEnter: (event) {
              // setState(() {
              //   selectedKey = "bigimg";
              // });
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.only(
                          left: 0, right: 8, top: 0, bottom: 0),
                      child: GestureDetector(
                          onTap: () {},
                          child: SvgPicture.asset(
                            "bundle/images/icons/bigimg.svg",
                            color: const Color(0xff444444),
                            height: 16,
                            width: 16,
                            //    fit: BoxFit.fitWidth
                          )),
                    ),
                    const Text(
                      "大图片",
                      style: TextStyle(fontSize: 12),
                    ),
                  ],
                ),
                const Text("2819")
              ],
            )),
      ),
      Container(
        height: 32,
        padding: const EdgeInsets.only(left: 16, right: 16),
        color:
            selectedKey == "jietu" ? const Color(0xffD3D3D3) : Colors.transparent,
        child: MouseRegion(
            onEnter: (event) {
              // setState(() {
              //   selectedKey = "jietu";
              // });
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.only(
                          left: 0, right: 8, top: 0, bottom: 0),
                      child: GestureDetector(
                          onTap: () {},
                          child: SvgPicture.asset(
                            "bundle/images/icons/jietu.svg",
                            color: const Color(0xff444444),
                            height: 16,
                            width: 16,
                            //    fit: BoxFit.fitWidth
                          )),
                    ),
                    const Text(
                      "屏幕截图",
                      style: TextStyle(fontSize: 12),
                    ),
                  ],
                ),
                const Text("123")
              ],
            )),
      ),
      Container(
        height: 32,
        padding: const EdgeInsets.only(left: 16, right: 16),
        color:
            selectedKey == "renwu" ? const Color(0xffD3D3D3) : Colors.transparent,
        child: MouseRegion(
            onEnter: (event) {
              // setState(() {
              //   selectedKey = "renwu";
              // });
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.only(
                          left: 0, right: 8, top: 0, bottom: 0),
                      child: GestureDetector(
                          onTap: () {},
                          child: SvgPicture.asset(
                            "bundle/images/icons/renwu.svg",
                            color: const Color(0xff444444),
                            height: 16,
                            width: 16,
                            //    fit: BoxFit.fitWidth
                          )),
                    ),
                    const Text(
                      "人物",
                      style: TextStyle(fontSize: 12),
                    ),
                  ],
                ),
                const Text("457")
              ],
            )),
      ),
      Container(
        height: 32,
        padding: const EdgeInsets.only(left: 16, right: 16),
        color:
            selectedKey == "dongwu" ? const Color(0xffD3D3D3) : Colors.transparent,
        child: MouseRegion(
            onEnter: (event) {
              // setState(() {
              //   selectedKey = "dongwu";
              // });
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.only(
                          left: 0, right: 8, top: 0, bottom: 0),
                      child: GestureDetector(
                          onTap: () {},
                          child: SvgPicture.asset(
                            "bundle/images/icons/dongwu.svg",
                            color: const Color(0xff444444),
                            height: 16,
                            width: 16,
                            //    fit: BoxFit.fitWidth
                          )),
                    ),
                    const Text(
                      "动物",
                      style: TextStyle(fontSize: 12),
                    ),
                  ],
                ),
                const Text("413")
              ],
            )),
      ),
      Container(
        height: 32,
        padding: const EdgeInsets.only(left: 16, right: 16),
        color:
            selectedKey == "wenzi" ? const Color(0xffD3D3D3) : Colors.transparent,
        child: MouseRegion(
            onEnter: (event) {
              // setState(() {
              //   selectedKey = "wenzi";
              // });
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.only(
                          left: 0, right: 8, top: 0, bottom: 0),
                      child: GestureDetector(
                          onTap: () {},
                          child: SvgPicture.asset(
                            "bundle/images/icons/wenzi.svg",
                            color: const Color(0xff444444),
                            height: 16,
                            width: 16,
                            //    fit: BoxFit.fitWidth
                          )),
                    ),
                    const Text(
                      "带文字",
                      style: TextStyle(fontSize: 12),
                    ),
                  ],
                ),
                const Text("1270")
              ],
            )),
      ),
      Container(
        height: 32,
        padding: const EdgeInsets.only(left: 16, right: 16),
        color:
            selectedKey == "chongfu" ? const Color(0xffD3D3D3) : Colors.transparent,
        child: MouseRegion(
            onEnter: (event) {
              // setState(() {
              //   selectedKey = "chongfu";
              // });
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.only(
                          left: 0, right: 8, top: 0, bottom: 0),
                      child: GestureDetector(
                          onTap: () {},
                          child: SvgPicture.asset(
                            "bundle/images/icons/chongfu.svg",
                            color: const Color(0xff444444),
                            height: 16,
                            width: 16,
                            //    fit: BoxFit.fitWidth
                          )),
                    ),
                    const Text(
                      "重复图片",
                      style: TextStyle(fontSize: 12),
                    ),
                  ],
                ),
                const Text("57")
              ],
            )),
      ),
      Container(
        height: 32,
        padding: const EdgeInsets.only(left: 16, right: 16),
        color: selectedKey == "lajitong"
            ? const Color(0xffD3D3D3)
            : Colors.transparent,
        child: MouseRegion(
            onEnter: (event) {
              // setState(() {
              //   selectedKey = "lajitong";
              // });
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.only(
                          left: 0, right: 8, top: 0, bottom: 0),
                      child: GestureDetector(
                          onTap: () {},
                          child: SvgPicture.asset(
                            "bundle/images/icons/lajitong.svg",
                            color: const Color(0xff444444),
                            height: 16,
                            width: 16,
                            //    fit: BoxFit.fitWidth
                          )),
                    ),
                    const Text(
                      "已删除",
                      style: TextStyle(fontSize: 12),
                    ),
                  ],
                ),
                const Text("35")
              ],
            )),
      ),
    ]);
  }
}
