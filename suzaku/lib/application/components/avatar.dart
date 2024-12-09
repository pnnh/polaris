import 'package:flutter/material.dart';

class AvatarWidget extends StatelessWidget {
  const AvatarWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(4.0),
      child: const SizedBox(
        width: 36,
        height: 36,
        child: Image(image: AssetImage('bundle/images/avatar.jpeg')),
      ),
    );
  }
}
