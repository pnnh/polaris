// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'folder.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FolderModel _$FolderModelFromJson(Map<String, dynamic> json) => FolderModel(
      json['pk'] as String,
      path: json['path'] as String,
    )..count = json['count'] as int;

Map<String, dynamic> _$FolderModelToJson(FolderModel instance) =>
    <String, dynamic>{
      'pk': instance.pk,
      'path': instance.path,
      'count': instance.count,
    };
