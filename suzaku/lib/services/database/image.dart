


import 'package:uuid/uuid.dart';

import '../../../models/picture.dart';
import 'database.dart';

Future insertImage(PictureModel model) async {

  var sqlTextInsertFolder = '''
insert into images(pk, basename, path)
values(?, ?, ?);
''';
  var pk = const Uuid().v4();
  await databaseInsert(sqlTextInsertFolder,
      [pk, model.basename, model.path]);

}
