import 'package:polaris/services/store/hive.dart';
import 'package:hive/hive.dart';
import 'package:json_annotation/json_annotation.dart';
// import 'package:uuid/uuid.dart';

part 'authorization.g.dart';

@JsonSerializable()
@HiveType(typeId: 0)
class AuthorizationModel {
  @HiveField(0)
  String tokenType = "";
  @HiveField(1)
  String accessToken = "";
}

class AuthorizationStore {
  static Future<AuthorizationModel> setCurrent(
      {String tokenType = "", String accessToken = ""}) async {
    // var uuid = const Uuid();
    //var key = uuid.v4().toString();
    var key = "current";
    var model = AuthorizationModel()
      ..accessToken = accessToken
      ..tokenType = tokenType;

    await HiveStore.put(key, model);
    return model;
  }

  static Future<AuthorizationModel?> findCurrent() {
    var model = HiveStore.get<String, AuthorizationModel>("current");
    return model;
  }
}
