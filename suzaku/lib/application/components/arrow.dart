import 'dart:math' as math;

import 'package:flutter/material.dart';

class VSArrowWidget extends StatelessWidget {
  final double transform;

  const VSArrowWidget({this.transform = 0, super.key});

  @override
  Widget build(BuildContext context) {
    var iconWidget =
        const Image(image: AssetImage('bundle/images/console/down-arrow.png'));
    if (this.transform == 0) return iconWidget;

    return Transform.rotate(
      alignment: Alignment.center,
      angle: this.transform * math.pi / 180,
      child: iconWidget,
    );
  }
}
