// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'resource.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ResourceModel _$ResourceModelFromJson(Map<String, dynamic> json) =>
    ResourceModel()
      ..pk = json['pk'] as String
      ..createAt = DateTime.parse(json['createat'] as String)
      ..updateAt = DateTime.parse(json['updateat'] as String)
      ..title = json['title'] as String
      ..description = json['description'] as String?
      ..creator = json['creator'] as String
      ..owner = json['owner'] as String?
      ..path = json['path'] as String?
      ..tags = json['tags'] as String?
      ..body = json['body'] as String?
      ..status = json['status'] as int
      ..cover = json['cover'] as String?;

Map<String, dynamic> _$ResourceModelToJson(ResourceModel instance) =>
    <String, dynamic>{
      'pk': instance.pk,
      'createat': instance.createAt.toIso8601String(),
      'updateat': instance.updateAt.toIso8601String(),
      'title': instance.title,
      'description': instance.description,
      'creator': instance.creator,
      'owner': instance.owner,
      'path': instance.path,
      'tags': instance.tags,
      'body': instance.body,
      'status': instance.status,
      'cover': instance.cover,
    };

ResourceModelQueryResult _$ResourceModelQueryResultFromJson(
        Map<String, dynamic> json) =>
    ResourceModelQueryResult()
      ..list = (json['list'] as List<dynamic>)
          .map((e) => ResourceModel.fromJson(e as Map<String, dynamic>))
          .toList()
      ..count = json['count'] as int;

Map<String, dynamic> _$ResourceModelQueryResultToJson(
        ResourceModelQueryResult instance) =>
    <String, dynamic>{
      'list': instance.list,
      'count': instance.count,
    };
