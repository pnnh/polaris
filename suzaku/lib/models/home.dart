
import 'package:json_annotation/json_annotation.dart'; 

import 'article.dart';

part 'home.g.dart';

@JsonSerializable()
class HomeResult {
  List<ArticleModel> range;
  int count;

  HomeResult({this.range = const [], this.count = 0});

  factory HomeResult.fromJson(Map<String, dynamic> json) =>
      _$HomeResultFromJson(json);

  Map<String, dynamic> toJson() => _$HomeResultToJson(this);
}
