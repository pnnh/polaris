---
image: cover.jpg
---


### 查看当前启用或禁用了哪些平台

```bash
User@MacBook mobile flutter config --list
All Settings:
  enable-web: false
  enable-linux-desktop: false
  enable-macos-desktop: false
  enable-windows-desktop: false
  enable-android: true
  enable-ios: true
  enable-fuchsia: (Not set) (Unavailable)
  enable-custom-devices: (Not set)
  cli-animations: (Not set)
  enable-native-assets: (Not set) (Unavailable)
```


### 启用一些平台

```bash
# 启用web
flutter config --enable-web
# 启用macos
flutter config --enable-macos-desktop
# 启用windows
flutter config --enable-windows-desktop
# 启用linux
flutter config --enable-linux-desktop
```


### 禁用一些平台

```bash
# 禁用web
flutter config --no-enable-web
# 禁用macos
flutter config --no-enable-macos-desktop
# 禁用windows
flutter config --no-enable-windows-desktop
# 禁用linux
flutter config --no-enable-linux-desktop
```
