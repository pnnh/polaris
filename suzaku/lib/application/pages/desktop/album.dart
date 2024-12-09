import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:polaris/application/components/loading.dart';
import 'package:polaris/models/album.dart';
import 'package:polaris/models/library.dart';
import 'package:polaris/services/album.dart';

import 'library.dart';


final StateProvider<String> _activeItem = StateProvider((_) => "");
final StateProvider<VSAlbumModel?> albumModelProvider =
    StateProvider((_) => null);

class VSAlbumWidget extends ConsumerStatefulWidget {
  final VSLibraryModel currentLibrary;

  const VSAlbumWidget(this.currentLibrary, {super.key});

  @override
  ConsumerState<VSAlbumWidget> createState() => _VSAlbumWidgetState();
}

class _VSAlbumWidgetState extends ConsumerState<VSAlbumWidget> {
  _VSAlbumWidgetState();

  @override
  Widget build(BuildContext context) {
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
              Text(widget.currentLibrary.title),
              GestureDetector(
                child: const Image(
                    image: AssetImage('bundle/images/console/down-arrow.png')),
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
          child: FutureBuilder(
            future: selectAlbums(widget.currentLibrary),
            builder: (BuildContext context,
                AsyncSnapshot<List<VSAlbumModel>> snapshot) {
              var albumModels = snapshot.data;
              if (albumModels == null) {
                return const VSLoading();
              }

              return SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: albumModels.map((album) {
                      return _ItemTitleWidget(album);
                    }).toList(),
                  ));
            },
          ),
        ))
      ]),
    );
  }
}

class _ItemTitleWidget extends ConsumerWidget {
  final VSAlbumModel albumModel;

  const _ItemTitleWidget(
      this.albumModel,{super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MouseRegion(
      child: Container(
        color: ref.watch(_activeItem) == albumModel.pk
            ? const Color(0xFFF2F2F2)
            : Colors.transparent,
        padding: EdgeInsets.only(left: 16, top: 8, bottom: 8, right: 16),
        child: Row(
          children: [
            GestureDetector(
              child: SizedBox(
                  width: 120,
                  child: Text(
                    albumModel.title,
                    softWrap: false,
                    textAlign: TextAlign.left,
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                  )),
              onTap: () {
                ref
                    .read(albumModelProvider.notifier)
                    .update((state) => albumModel);
              },
            )
          ],
        ),
      ),
      onEnter: (event) {
        ref.read(_activeItem.notifier).update((state) => albumModel.pk);
      },
      onExit: (event) {
        ref.read(_activeItem.notifier).update((state) => "");
      },
    );
  }
}
