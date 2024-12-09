// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'search.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SearchModel _$SearchModelFromJson(Map<String, dynamic> json) => SearchModel(
      json['pk'] as String,
      header: json['header'] as String? ?? "",
      body: json['body'] as String? ?? "",
      highlight: json['highlight'] as String?,
    );

Map<String, dynamic> _$SearchModelToJson(SearchModel instance) =>
    <String, dynamic>{
      'pk': instance.pk,
      'header': instance.header,
      'body': instance.body,
      'highlight': instance.highlight,
    };
