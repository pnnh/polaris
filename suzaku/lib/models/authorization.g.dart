// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'authorization.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class AuthorizationModelAdapter extends TypeAdapter<AuthorizationModel> {
  @override
  final int typeId = 0;

  @override
  AuthorizationModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return AuthorizationModel()
      ..tokenType = fields[0] as String
      ..accessToken = fields[1] as String;
  }

  @override
  void write(BinaryWriter writer, AuthorizationModel obj) {
    writer
      ..writeByte(2)
      ..writeByte(0)
      ..write(obj.tokenType)
      ..writeByte(1)
      ..write(obj.accessToken);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AuthorizationModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthorizationModel _$AuthorizationModelFromJson(Map<String, dynamic> json) =>
    AuthorizationModel()
      ..tokenType = json['tokenType'] as String
      ..accessToken = json['accessToken'] as String;

Map<String, dynamic> _$AuthorizationModelToJson(AuthorizationModel instance) =>
    <String, dynamic>{
      'tokenType': instance.tokenType,
      'accessToken': instance.accessToken,
    };
