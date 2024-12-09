import 'package:json_annotation/json_annotation.dart';
import 'package:path/path.dart';

part 'picture.g.dart';

@JsonSerializable()
class PictureModel {
  String pk;
  String basename;
  String path;

  PictureModel(this.pk, this.basename, this.path);

  factory PictureModel.fromJson(Map<String, dynamic> json) =>
      _$PictureModelFromJson(json);

  Map<String, dynamic> toJson() => _$PictureModelToJson(this);
 
}

@JsonSerializable()
class PictureQueryResult {
  List<PictureModel> list = [];
  int count = 0;

  PictureQueryResult();

  factory PictureQueryResult.fromJson(Map<String, dynamic> json) =>
      _$PictureQueryResultFromJson(json);

  Map<String, dynamic> toJson() => _$PictureQueryResultToJson(this);
}
