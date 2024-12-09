import 'package:flutter/material.dart';

class VSLoading extends StatelessWidget {
  const VSLoading({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFF9F9F9),
      width: 200,
      padding: const EdgeInsets.all(16),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            height: 12,
            width: 12,
            child: CircularProgressIndicator(),
          ),
        ],
      ),
    );
  }
}
