

## 在web编译时选择渲染引擎

详细参考以下链接：https://docs.flutter.dev/development/tools/web-renderers

```shell
flutter run -d chrome --web-renderer html
flutter build web --release --web-renderer auto --dart-define=FLUTTER_WEB_CANVASKIT_URL=canvaskit/  
flutter build web --release --web-renderer html
```

## 生成模型样板代码

```shell
flutter pub run build_runner build
flutter pub run build_runner build --delete-conflicting-outputs
```

### web服务启动配置端口

```bash
flutter run -d chrome --web-hostname=127.0.0.1 --web-port=3500
```

在运维flutter web时需要指定本地自签名证书，避免一些错误提示

对于一些外部平台的接入有时候又必须要有https域名

```bash
flutter run -d chrome --web-renderer html \
    --web-hostname=127.0.0.1 \
    --web-port=8800 \
    --web-tls-cert-path=localhost.pem \
    --web-tls-cert-key-path=localhost-key.pem
```

关于本地签发证书可以似乎用mkcert工具，支持各个平台
https://github.com/FiloSottile/mkcert/releases