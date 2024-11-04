#include "tests/tests.h"
#include "services/MarkdownService.h"
#include "services/SqliteService.h"
#include <QGuiApplication>
#include <QLoggingCategory>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQmlDebuggingEnabler>
#include <QQuickWindow>
#include <iostream>
#include <spdlog/spdlog.h>

int TestSqliteVersion() {
  auto database_path = QGuiApplication::applicationDirPath() + "/venus.sqlite";
  auto version = services::SqliteService::sql_version(database_path);

  qDebug() << "sqlite3 version: " << version;
  int isOk = (int)version.indexOf("3.");
  return isOk;
}

int TestMarkdown() {
  auto markdownText = R"(
## 二级标题

这是一段普通文字：

予观夫巴陵胜状，在洞庭一湖。衔远山，吞长江，浩浩汤汤，横无际涯；朝晖夕阴，气象万千。此则岳阳楼之大观也，前人之述备矣。然则北通巫峡，南极潇湘，迁客骚人，多会于此，览物之情，得无异乎？若夫霪雨霏霏，连月不开，阴风怒号，浊浪排空；日星隐曜，山岳潜形；商旅不行，樯倾楫摧；薄暮冥冥，虎啸猿啼。登斯楼也，则有去国怀乡，忧谗畏讥，满目萧然，感极而悲者矣。至若春和景明，波澜不惊，上下天光，一碧万顷；沙鸥翔集，锦鳞游泳；岸芷汀兰，郁郁青青。而或长烟一空，皓月千里，浮光跃金，静影沉璧，渔歌互答，此乐何极！登斯楼也，则有心旷神怡，宠辱偕忘，把酒临风，其喜洋洋者矣。

这是**加粗**，*斜体*，~~删除线~~，[链接](https://blog.imalan.cn)。

这是块引用与嵌套块引用：

> 安得广厦千万间，大庇天下寒士俱欢颜！风雨不动安如山。
> > 呜呼！何时眼前突兀见此屋，吾庐独破受冻死亦足！

这是无序列表：

* 苹果
    * 红将军
    * 元帅
* 香蕉
* 梨

这是有序列表：

1. 打开冰箱
    1. 右手放在冰箱门拉手上
    2. 左手扶住冰箱主体
    3. 右手向后用力
2. 把大象放进冰箱
3. 关上冰箱

这是表格：

第一格表头 | 第二格表头
--------- | -------------
内容单元格 第一列第一格 | 内容单元格第二列第一格
内容单元格 第一列第二格 多加文字 | 内容单元格第二列第二格
            )";

  auto htmlText = services::markdownToHtml(markdownText);
  auto titleIndex = htmlText.indexOf("<h2>");
  if (titleIndex < 0) {
    return -1;
  }
  auto paragraphIndex = htmlText.indexOf("<p>");
  if (paragraphIndex < 0)
    return -1;
  auto blockquoteIndex = htmlText.indexOf("<blockquote>");
  if (blockquoteIndex < 0)
    return -1;

  return 0;
}