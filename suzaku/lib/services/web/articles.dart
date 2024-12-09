import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:polaris/config.dart';
import 'package:polaris/models/article.dart';

class WArticleService {
  static Future<ArticleModel?> getArticle(String pk) async {
    var url = Uri.parse('${AppConfig.serverUrl}/articles/get?uid=$pk');
    var response = await http.get(url);
    var decodedResponse =
        jsonDecode(utf8.decode(response.bodyBytes)) as Map<String, dynamic>;
    var result = ArticleModel.fromJson(decodedResponse);
    return result;
  }
}
