import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:polaris/application/components/empty.dart';
import 'package:polaris/models/library.dart';

import 'album.dart';


final StateProvider<String> _activeItem = StateProvider((_) => "");
final StateProvider<String> activeSelectLibrary = StateProvider((_) => "");

class VSLibraryWidget extends ConsumerWidget {
  final List<VSLibraryModel> libraries;
  const VSLibraryWidget(this.libraries, {super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (libraries.isEmpty) {
      return const VSEmptyWidget();
    }
    if (ref.watch(activeSelectLibrary).isEmpty) {
      return VSAlbumWidget(libraries.first);
    }
    var currentKey = ref.watch(activeSelectLibrary);
    if (currentKey != "XXX") {
      var newLibrary = libraries.firstWhere(
          (element) => element.uid == ref.watch(activeSelectLibrary),
          orElse: () => libraries.first);
      return VSAlbumWidget(newLibrary);
    }
    return Container(
      color: const Color(0xFFF9F9F9),
      width: 200,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Container(
          height: 40,
          color: const Color(0xFFF2F2F2),
          child: Row(
            children: [
              const SizedBox(
                width: 16,
              ),
              const Text("选择图集"),
              GestureDetector(
                child: Transform(
                  alignment: Alignment.center,
                  transform: Matrix4.rotationX(180),
                  child: const Image(
                      image:
                          AssetImage('bundle/images/console/down-arrow.png')),
                ),
                onTap: () {
                  ref.read(activeSelectLibrary.notifier).update((state) => "XXX");
                },
              )
            ],
          ),
        ),
        Expanded(
            child: Container(
                width: double.infinity,
                padding: EdgeInsets.zero,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: libraries.map((album) => _ItemWidget(album)).toList(),
                )))
      ]),
    );
  }
}

class _ItemWidget extends ConsumerWidget {
  final VSLibraryModel libraryModel;
  const _ItemWidget(this.libraryModel);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MouseRegion(
      child: GestureDetector(
        child: Container(
          padding:
              const EdgeInsets.only(left: 16, right: 16, top: 8, bottom: 8),
          width: double.infinity,
          color: ref.watch(_activeItem) == libraryModel.uid
              ? const Color(0xFFF2F2F2)
              : Colors.transparent,
          child: Text(libraryModel.title),
        ),
        onTap: () {
          ref.read(activeSelectLibrary.notifier).update((state) => libraryModel.uid);
        },
      ),
      onEnter: (event) {
        ref.read(_activeItem.notifier).update((state) => libraryModel.uid);
      },
      onExit: (event) {
        ref.read(_activeItem.notifier).update((state) => "");
      },
    );
  }
}
