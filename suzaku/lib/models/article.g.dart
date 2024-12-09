// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'article.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ArticleModel _$ArticleModelFromJson(Map<String, dynamic> json) => ArticleModel(
      uid: json['uid'] as String? ?? "",
      title: json['title'] as String? ?? "",
      body: json['body'] as String? ?? "",
    )
      ..description = json['description'] as String?
      ..mime = json['mime'] as String?
      ..createTime = json['create_time'] == null
          ? null
          : DateTime.parse(json['create_time'] as String)
      ..updateTime = json['update_time'] == null
          ? null
          : DateTime.parse(json['update_time'] as String)
      ..created = json['created'] as int?
      ..cover = json['cover'] as String?
      ..keywordsList = (json['keywords_list'] as List<dynamic>?)
          ?.map((e) => e as String)
          .toList();

Map<String, dynamic> _$ArticleModelToJson(ArticleModel instance) =>
    <String, dynamic>{
      'uid': instance.uid,
      'title': instance.title,
      'description': instance.description,
      'mime': instance.mime,
      'body': instance.body,
      'create_time': instance.createTime?.toIso8601String(),
      'update_time': instance.updateTime?.toIso8601String(),
      'created': instance.created,
      'cover': instance.cover,
      'keywords_list': instance.keywordsList,
    };

ArticleFindResult _$ArticleFindResultFromJson(Map<String, dynamic> json) =>
    ArticleFindResult(
      data: json['data'] == null
          ? null
          : ArticleModel.fromJson(json['data'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$ArticleFindResultToJson(ArticleFindResult instance) =>
    <String, dynamic>{
      'data': instance.data,
    };
