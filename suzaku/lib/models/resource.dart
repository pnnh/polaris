// import 'dart:convert';

// import 'package:polaris/services/models/picture.dart';
import 'package:json_annotation/json_annotation.dart';

part 'resource.g.dart';

enum ResourceHeader {
  @JsonValue("0")
  unknown("0"),
  @JsonValue("1")
  article("1"),
  @JsonValue("2")
  picture("2");

  final String value;

  const ResourceHeader(this.value);
}

@JsonSerializable()
class ResourceModel {
  String pk = "";
  @JsonKey(name: 'createat')
  DateTime createAt = DateTime(0);
  @JsonKey(name: 'updateat')
  DateTime updateAt = DateTime(0);
  String title = "";
  String? description = "";
  String creator = "";
  String? owner = "";
  String? path = "";
  String? tags = "";
  String? body = "";
  @JsonKey(ignore: true)
  dynamic bodyObject; 
  int status = 0; 
  String? cover = "";

  ResourceModel();

  factory ResourceModel.fromJson(Map<String, dynamic> json) {
    return _$ResourceModelFromJson(json);
  }

  Map<String, dynamic> toJson() => _$ResourceModelToJson(this);


  T? getBody<T>() {
    if (bodyObject == null) {
      if (body == null) return null;
    }
    return bodyObject as T;
  }
}

@JsonSerializable()
class ResourceModelQueryResult {
  List<ResourceModel> list = [];
  int count = 0;

  ResourceModelQueryResult();

  factory ResourceModelQueryResult.fromJson(Map<String, dynamic> json) =>
      _$ResourceModelQueryResultFromJson(json);

  Map<String, dynamic> toJson() => _$ResourceModelQueryResultToJson(this);
}
