import 'dart:convert';

import 'package:json_annotation/json_annotation.dart';

part 'article.g.dart';

@JsonSerializable()
class ArticleModel {
  String uid = "";
  String title = "";
  String? description = "";
  String? mime = "";
  String? body = "";
  @JsonKey(name: 'create_time')
  DateTime? createTime = DateTime.utc(0);
  @JsonKey(name: 'update_time')
  DateTime? updateTime = DateTime.utc(0);
  int? created = 0;
  String? cover = "";
  @JsonKey(name: 'keywords_list')
  List<String>? keywordsList = <String>[];

  ArticleModel(
      {this.uid = "", this.title = "", this.body = ""});

  factory ArticleModel.fromJson(Map<String, dynamic> json) =>
      _$ArticleModelFromJson(json);

  Map<String, dynamic> toJson() => _$ArticleModelToJson(this);
}

@JsonSerializable()
class ArticleFindResult {
  ArticleModel? data;

  ArticleFindResult({this.data});

  factory ArticleFindResult.fromJson(Map<String, dynamic> json) =>
      _$ArticleFindResultFromJson(json);

  Map<String, dynamic> toJson() => _$ArticleFindResultToJson(this);
}
