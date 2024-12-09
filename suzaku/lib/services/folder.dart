
import 'package:file_picker/file_picker.dart';
import 'package:polaris/models/folder.dart';
import 'package:polaris/utils/logger.dart';

import '../utils/random.dart';
import 'database.dart';


class Folders {
  static Future<FolderModel?> pickFolder() async {
    String? selectedDirectory = await FilePicker.platform.getDirectoryPath();

    if (selectedDirectory != null) {
      logger.d("selectedDirectory: $selectedDirectory");
 
      var pk = generateRandomString(16);
      var newFolder = FolderModel(pk,
          path: selectedDirectory);
      await insertFolder(newFolder);

      return newFolder;
    }

    return null;
  }
}

Future<FolderModel?> getFolder(String pk) async {
  var sqlText = "select * from folders where pk = ?";

  var list = await DBHelper().selectAsync(sqlText, [pk]);

  logger.d("list ${list.length}");

  if (list.isNotEmpty) {
    return FolderModel.fromJson(list[0]);
  }

  return null;
}

Future<void> updateFilesCount(String pk, int count) async {
  var sqlText = '''update folders set count = ? where pk = ?;''';

  await DBHelper().executeAsync(sqlText, [count, pk]);
}

Future<void> insertFolder(FolderModel model) async {
  var sqlTextInsertFolder = '''
insert into folders(pk, path, count)
values(?, ?, 0);
''';
  var pk = generateRandomString(8);
  var dbInstance = DBHelper.instance;
  await dbInstance.executeAsync(sqlTextInsertFolder, [pk, model.path]);
}

Future<List<FolderModel>> queryFolders(String a) async {
  var sqlText = '''select * from folders;''';

  var list = await DBHelper().selectAsync(sqlText);

  logger.d("list ${list.length}");

  var foldersList = List.generate(list.length, (i) {
    return FolderModel.fromJson(list[i]);
  });

  return foldersList;
}
