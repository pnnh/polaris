// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'home.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

HomeResult _$HomeResultFromJson(Map<String, dynamic> json) => HomeResult(
      range: (json['range'] as List<dynamic>?)
              ?.map((e) => ArticleModel.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
      count: json['count'] as int? ?? 0,
    );

Map<String, dynamic> _$HomeResultToJson(HomeResult instance) =>
    <String, dynamic>{
      'range': instance.range,
      'count': instance.count,
    };
