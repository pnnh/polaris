import 'package:json_annotation/json_annotation.dart';

part 'search.g.dart';

@JsonSerializable()
class SearchModel {
  String pk;
  String header;
  String body;
  String? highlight;

  SearchModel(this.pk,
      {this.header = "",
        this.body = "",
        this.highlight});

  factory SearchModel.fromJson(Map<String, dynamic> json) =>
      _$SearchModelFromJson(json);

  Map<String, dynamic> toJson() => _$SearchModelToJson(this);
}
