import 'package:flutter/material.dart';

class LayoutHelper {
  static int mainGridColumns(BuildContext context) {
    var isScreenPhone = ScreenHelper.isScreenPhone(context);
    var isScreenTablet = ScreenHelper.isScreenTablet(context);
    if (isScreenPhone) return 4;
    if (isScreenTablet) return 8;
    return 16;
  }

  static double mainContainerWidth(BuildContext context) {
    var isScreenPhone = ScreenHelper.isScreenPhone(context);
    var isScreenTablet = ScreenHelper.isScreenTablet(context);
    if (isScreenPhone) return 320;
    if (isScreenTablet) return 640;
    return 1280;
  }
}

class ScreenHelper {
  static const int screenSmall = 320;
  static const int screenMedium = 640;
  static const int screenLarge = 1280;
  static const int screenPhone = screenSmall;
  static const int screenTablet = screenMedium;
  static const int screenDesktop = screenLarge;

  static bool isScreenPhone(BuildContext context) {
    return MediaQuery.of(context).size.width <= screenPhone;
  }

  static bool isScreenTablet(BuildContext context) {
    return MediaQuery.of(context).size.width <= screenPhone;
  }

  static bool isScreenDesktop(BuildContext context) {
    return MediaQuery.of(context).size.width <= screenPhone;
  }

  static double getScreenHeight(BuildContext context) {
    return MediaQuery.of(context).size.height;
  }

  static double getScreenWidth(BuildContext context) {
    return MediaQuery.of(context).size.width;
  }

  static double getScreenHeightWithoutSafeArea(BuildContext context) {
    return getScreenHeight(context) -
        MediaQuery.of(context).padding.top -
        MediaQuery.of(context).padding.bottom;
  }

  static double getScreenWidthWithoutSafeArea(BuildContext context) {
    return getScreenWidth(context) -
        MediaQuery.of(context).padding.left -
        MediaQuery.of(context).padding.right;
  }

  static double getStatusBarHeight(BuildContext context) {
    return MediaQuery.of(context).padding.top;
  }

  static double getNavigationBarHeight(BuildContext context) {
    return MediaQuery.of(context).padding.bottom;
  }
}
