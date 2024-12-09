import 'package:json_annotation/json_annotation.dart';

part 'filter.g.dart';

@JsonSerializable()
class PictureFilter {
  String pk;
  String title;
  int count;
  String icon;

  PictureFilter(this.pk,
      {this.title = "",
      this.count = 0,
      this.icon = "bundle/images/icons/folder.svg"});

  factory PictureFilter.fromJson(Map<String, dynamic> json) =>
      _$PictureFilterFromJson(json);

  Map<String, dynamic> toJson() => _$PictureFilterToJson(this);
}

Future<List<PictureFilter>> queryPictureFilters() {
  var list = <PictureFilter>[];
  list.add(PictureFilter("0",
      title: "所有图片", count: 3258, icon: "bundle/images/icons/folder.svg"));
  list.add(PictureFilter("1",
      title: "动图", count: 19, icon: "bundle/images/icons/folder.svg"));
  list.add(PictureFilter("2",
      title: "Images", count: 2190, icon: "bundle/images/icons/folder.svg"));
  list.add(PictureFilter("3",
      title: "搞笑", count: 182, icon: "bundle/images/icons/folder.svg"));
  list.add(PictureFilter("4",
      title: "骚气图片", count: 781, icon: "bundle/images/icons/folder.svg"));
  list.add(PictureFilter("5",
      title: "沙雕图片", count: 2819, icon: "bundle/images/icons/folder.svg"));
  list.add(PictureFilter("6",
      title: "大图片", count: 3781, icon: "bundle/images/icons/bigimg.svg"));
  list.add(PictureFilter("7",
      title: "屏幕截图", count: 123, icon: "bundle/images/icons/jietu.svg"));
  list.add(PictureFilter("8",
      title: "人物", count: 681, icon: "bundle/images/icons/renwu.svg"));
  list.add(PictureFilter("dongwu",
      title: "动物", count: 413, icon: "bundle/images/icons/dongwu.svg"));
  list.add(PictureFilter("wenzi",
      title: "带文字", count: 1270, icon: "bundle/images/icons/wenzi.svg"));
  list.add(PictureFilter("chongfu",
      title: "重复图片", count: 57, icon: "bundle/images/icons/chongfu.svg"));
  list.add(PictureFilter("shanchu",
      title: "已删除", count: 35, icon: "bundle/images/icons/lajitong.svg"));
  list.add(PictureFilter("shoucang",
      title: "收藏", count: 189, icon: "bundle/images/icons/shoucang.svg"));
  list.add(PictureFilter("hao",
      title: "好", count: 495, icon: "bundle/images/icons/hao.svg"));
  list.add(PictureFilter("cha",
      title: "差", count: 71, icon: "bundle/images/icons/cha.svg"));

  return Future(() => list);
}
