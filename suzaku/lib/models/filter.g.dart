// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'filter.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PictureFilter _$PictureFilterFromJson(Map<String, dynamic> json) =>
    PictureFilter(
      json['pk'] as String,
      title: json['title'] as String? ?? "",
      count: json['count'] as int? ?? 0,
      icon: json['icon'] as String? ?? "bundle/images/icons/folder.svg",
    );

Map<String, dynamic> _$PictureFilterToJson(PictureFilter instance) =>
    <String, dynamic>{
      'pk': instance.pk,
      'title': instance.title,
      'count': instance.count,
      'icon': instance.icon,
    };
