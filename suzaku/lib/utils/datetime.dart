// 将纳秒时间戳转换为友好格式
String formatDateTime(int nanoseconds) {
  var timeStr =
  DateTime.fromMicrosecondsSinceEpoch((nanoseconds / 1000).round())
      .toString();
  return timeStr.substring(0, 16);
}
