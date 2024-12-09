// import 'package:flutter/material.dart';
// import 'package:flutter_riverpod/flutter_riverpod.dart';
// import 'package:polaris/application/components/arrow.dart';
// import 'package:polaris/application/components/loading.dart';
// import 'package:polaris/models/album.dart';
// import 'package:polaris/models/library.dart';
// import 'package:polaris/services/album.dart';
//
// import 'library.dart';
//
// final StateProvider<String> _activeItem = StateProvider((_) => "");
// final StateProvider<VSAlbumModel?> albumModelProvider =
//     StateProvider((_) => null);
//
// class VSAlbumWidget extends ConsumerStatefulWidget {
//   final VSLibraryModel currentLibrary;
//
//   const VSAlbumWidget(this.currentLibrary, {super.key});
//
//   @override
//   ConsumerState<VSAlbumWidget> createState() => _VSAlbumWidgetState();
// }
//
// class _VSAlbumWidgetState extends ConsumerState<VSAlbumWidget> {
//   final ScrollController _vCtrl = ScrollController();
//
//   _VSAlbumWidgetState();
//
//   /// 计算文字宽度
//   double calculateText(String text, TextStyle style) {
//     final TextPainter textPainter = TextPainter(
//         textAlign: TextAlign.left,
//         textDirection: TextDirection.ltr,
//         text: TextSpan(text: text, style: style));
//     textPainter.layout();
//     return textPainter.width;
//   }
//
//   @override
//   void dispose() {
//     _vCtrl.dispose();
//     super.dispose();
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       color: const Color(0xFFF9F9F9),
//       width: 200,
//       child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
//         Container(
//           height: 40,
//           color: const Color(0xFFF2F2F2),
//           child: Row(
//             children: [
//               const SizedBox(
//                 width: 16,
//               ),
//               Text(widget.currentLibrary.title),
//               GestureDetector(
//                 child: const Image(
//                     image: AssetImage('bundle/images/console/down-arrow.png')),
//                 onTap: () {
//                   ref.read(activeSelectLibrary.notifier).update((state) => "XXX");
//                 },
//               )
//             ],
//           ),
//         ),
//         Expanded(
//             child: Container(
//           width: double.infinity,
//           padding: EdgeInsets.zero,
//           child: FutureBuilder(
//             future: selectAlbums(widget.currentLibrary),
//             builder: (BuildContext context,
//                 AsyncSnapshot<List<VSAlbumModel>> snapshot) {
//               var albumModels = snapshot.data;
//               if (albumModels == null) {
//                 return const VSLoading();
//               }
//
//               return SingleChildScrollView(
//                   scrollDirection: Axis.horizontal,
//                   child: Column(
//                     crossAxisAlignment: CrossAxisAlignment.start,
//                     children: albumModels.map((album) {
//                       return _ItemWidget(album);
//                     }).toList(),
//                   ));
//             },
//           ),
//         ))
//       ]),
//     );
//   }
// }
//
// class _ItemWidget extends ConsumerWidget {
//   final VSAlbumModel albumModel;
//   final int level;
//   final StateProvider<bool> openSub = StateProvider<bool>((_) => false);
//
//   _ItemWidget(this.albumModel, {this.level = 0, super.key});
//
//   @override
//   Widget build(BuildContext context, WidgetRef ref) {
//     return FutureBuilder<List<VSAlbumModel>>(
//       future: selectSubDirectories(albumModel),
//       builder: (BuildContext context,
//           AsyncSnapshot<List<VSAlbumModel>> snapshot) {
//         var subAlbumModels = snapshot.data;
//         var showSubModels = ref.watch(openSub) ? subAlbumModels ?? [] : [];
//         return Container(
//             width: double.infinity,
//             child: Column(
//               children: [
//                 _ItemTitleWidget(
//                   albumModel,
//                   openSub,
//                   subAlbumModels ?? [],
//                   level: this.level,
//                 ),
//                 ...showSubModels
//                     .map((e) => _ItemWidget(
//                           e,
//                           level: this.level + 1,
//                         ))
//                     .toList()
//               ],
//             ));
//       },
//     );
//   }
// }
//
// class _ItemTitleWidget extends ConsumerWidget {
//   final VSAlbumModel albumModel;
//   final StateProvider<bool> openSub;
//   final int level;
//   final List<VSAlbumModel> subAlbumModels;
//
//   const _ItemTitleWidget(
//       this.albumModel, this.openSub, this.subAlbumModels,
//       {this.level = 0, super.key});
//
//   @override
//   Widget build(BuildContext context, WidgetRef ref) {
//     return MouseRegion(
//       child: Container(
//         color: ref.watch(_activeItem) == albumModel.pk
//             ? const Color(0xFFF2F2F2)
//             : Colors.transparent,
//         padding: EdgeInsets.only(left: 16, top: 8, bottom: 8, right: 16),
//         child: Row(
//           children: [
//             SizedBox(
//               width: this.level * 16,
//             ),
//             GestureDetector(
//               child: this.subAlbumModels.length > 0
//                   ? VSArrowWidget(transform: ref.watch(openSub) ? 0 : -90)
//                   : SizedBox(
//                       height: 16,
//                       width: 16,
//                     ),
//               onTap: () {
//                 ref.read(openSub.notifier).update((state) => !state);
//               },
//             ),
//             GestureDetector(
//               child: SizedBox(
//                   width: 120,
//                   child: Text(
//                     albumModel.title,
//                     softWrap: false,
//                     textAlign: TextAlign.left,
//                     overflow: TextOverflow.ellipsis,
//                     maxLines: 1,
//                   )),
//               onTap: () {
//                 ref
//                     .read(albumModelProvider.notifier)
//                     .update((state) => albumModel);
//               },
//             )
//           ],
//         ),
//       ),
//       onEnter: (event) {
//         ref.read(_activeItem.notifier).update((state) => albumModel.pk);
//       },
//       onExit: (event) {
//         ref.read(_activeItem.notifier).update((state) => "");
//       },
//     );
//   }
// }
