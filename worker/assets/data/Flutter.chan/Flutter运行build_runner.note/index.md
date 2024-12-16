---
image: cover.png
---

首先在```pubspec.yaml```中添加```build_runner```依赖：

```yaml
dev_dependencies:
  build_runner:
```

之后运行build_runner生成器命令：

```bash
dart run build_runner build
```

也可以传递watch参数，实现自动监听文件变化并生成：

```bash
dart run build_runner watch
```

需要注意，build_runner一般是搭配```json_serializable```等库使用

使用时需要在类模型上添加相应注解，如：

```dart
import 'package:json_annotation/json_annotation.dart';

part 'example.g.dart';

@JsonSerializable()
class Person {
  final String firstName, lastName;
  final DateTime? dateOfBirth;

  Person({required this.firstName, required this.lastName, this.dateOfBirth});

  factory Person.fromJson(Map<String, dynamic> json) => _$PersonFromJson(json);

  Map<String, dynamic> toJson() => _$PersonToJson(this);
}
```

之后运行```build_runner```命令才会生成相关代码。

除了```json_serializable```之外还有许多其他库也需要配合```build_runner```使用，如```freezed```、```hive```等。

```build_runner```的作用是根据注解生成代码，可以理解为是一个代码生成器。

具体请在使用时参考相应库的文档。