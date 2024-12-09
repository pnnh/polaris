import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class FilterGroupWidget extends StatefulWidget {
  const FilterGroupWidget({super.key});

  @override
  State<FilterGroupWidget> createState() => _FilterGroupWidget();
}

class _FilterGroupWidget extends State<FilterGroupWidget> {
  int selectedIndex = 0;
  int hoveredIndex = 0;
  final Color selectedColor = const Color.fromRGBO(238, 243, 254, 100);
  final Color defaultColor = Colors.white;
  final Color iconColor = const Color.fromRGBO(153, 153, 153, 100);
  final Color fontColor = const Color.fromRGBO(0, 150, 251, 100);

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: const EdgeInsets.only(top: 16),
        child: Column(children: [
          Padding(
            padding: const EdgeInsets.only(left: 8, right: 8),
            child: ClipRRect(
                borderRadius: BorderRadius.circular(4.0),
                child: MouseRegion(
                    child: TextButton(
                        onPressed: () {
                          setState(() {
                            selectedIndex = 0;
                          });
                        },
                        style: ButtonStyle(
                            backgroundColor: MaterialStateProperty.all(
                                selectedIndex == 0 || hoveredIndex == 0
                                    ? selectedColor
                                    : defaultColor)),
                        child: Container(
                            padding: const EdgeInsets.all(8),
                            child: Row(children: [
                              SvgPicture.asset(
                                "bundle/images/icons/wallet.svg",
                                color: iconColor,
                              ),
                              const SizedBox(width: 8),
                              Text("所有",
                                  style: TextStyle(
                                      color: selectedIndex == 0 ||
                                              hoveredIndex == 0
                                          ? fontColor
                                          : Colors.black))
                            ]))),
                    onHover: (value) {
                      setState(() {
                        hoveredIndex = 0;
                      });
                    },
                    onExit: (value) {
                      setState(() {
                        hoveredIndex = selectedIndex;
                      });
                    })),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 8, right: 8),
            child: ClipRRect(
                borderRadius: BorderRadius.circular(4.0),
                child: MouseRegion(
                    child: TextButton(
                        onPressed: () {
                          setState(() {
                            selectedIndex = 1;
                          });
                        },
                        style: ButtonStyle(
                            backgroundColor: MaterialStateProperty.all(
                                selectedIndex == 1 || hoveredIndex == 1
                                    ? selectedColor
                                    : defaultColor)),
                        child: Container(
                            padding: const EdgeInsets.all(8),
                            child: Row(children: [
                              SvgPicture.asset(
                                "bundle/images/icons/bill.svg",
                                color: iconColor,
                              ),
                              const SizedBox(width: 8),
                              Text("今天",
                                  style: TextStyle(
                                      color: selectedIndex == 1 ||
                                              hoveredIndex == 1
                                          ? fontColor
                                          : Colors.black))
                            ]))),
                    onHover: (value) {
                      setState(() {
                        hoveredIndex = 1;
                      });
                    },
                    onExit: (value) {
                      setState(() {
                        hoveredIndex = selectedIndex;
                      });
                    })),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 8, right: 8),
            child: ClipRRect(
                borderRadius: BorderRadius.circular(4.0),
                child: MouseRegion(
                    child: TextButton(
                        onPressed: () {
                          setState(() {
                            selectedIndex = 2;
                          });
                        },
                        style: ButtonStyle(
                            backgroundColor: MaterialStateProperty.all(
                                selectedIndex == 2 || hoveredIndex == 2
                                    ? selectedColor
                                    : defaultColor)),
                        child: Container(
                            padding: const EdgeInsets.all(8),
                            child: Row(children: [
                              SvgPicture.asset(
                                "bundle/images/icons/sun.svg",
                                color: iconColor,
                              ),
                              const SizedBox(width: 8),
                              Text("明天",
                                  style: TextStyle(
                                      color: selectedIndex == 2 ||
                                              hoveredIndex == 2
                                          ? fontColor
                                          : Colors.black))
                            ]))),
                    onHover: (value) {
                      setState(() {
                        hoveredIndex = 2;
                      });
                    },
                    onExit: (value) {
                      setState(() {
                        hoveredIndex = selectedIndex;
                      });
                    })),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 8, right: 8),
            child: ClipRRect(
                borderRadius: BorderRadius.circular(4.0),
                child: MouseRegion(
                    child: TextButton(
                        onPressed: () {
                          setState(() {
                            selectedIndex = 3;
                          });
                        },
                        style: ButtonStyle(
                            backgroundColor: MaterialStateProperty.all(
                                selectedIndex == 3 || hoveredIndex == 3
                                    ? selectedColor
                                    : defaultColor)),
                        child: Container(
                            padding: const EdgeInsets.all(8),
                            child: Row(children: [
                              SvgPicture.asset(
                                "bundle/images/icons/archive_drawer.svg",
                                color: iconColor,
                              ),
                              const SizedBox(width: 8),
                              Text("最近7天",
                                  style: TextStyle(
                                      color: selectedIndex == 3 ||
                                              hoveredIndex == 3
                                          ? fontColor
                                          : Colors.black))
                            ]))),
                    onHover: (value) {
                      setState(() {
                        hoveredIndex = 3;
                      });
                    },
                    onExit: (value) {
                      setState(() {
                        hoveredIndex = selectedIndex;
                      });
                    })),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 8, right: 8),
            child: ClipRRect(
                borderRadius: BorderRadius.circular(4.0),
                child: MouseRegion(
                    child: TextButton(
                        onPressed: () {
                          setState(() {
                            selectedIndex = 4;
                          });
                        },
                        style: ButtonStyle(
                            backgroundColor: MaterialStateProperty.all(
                                selectedIndex == 4 || hoveredIndex == 4
                                    ? selectedColor
                                    : defaultColor)),
                        child: Container(
                            padding: const EdgeInsets.all(8),
                            child: Row(children: [
                              SvgPicture.asset(
                                "bundle/images/icons/stack.svg",
                                color: iconColor,
                              ),
                              const SizedBox(width: 8),
                              Text("收集箱",
                                  style: TextStyle(
                                      color: selectedIndex == 4 ||
                                              hoveredIndex == 4
                                          ? fontColor
                                          : Colors.black))
                            ]))),
                    onHover: (value) {
                      setState(() {
                        hoveredIndex = 4;
                      });
                    },
                    onExit: (value) {
                      setState(() {
                        hoveredIndex = selectedIndex;
                      });
                    })),
          ),
        ]));
  }
}
