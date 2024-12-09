
import 'package:polaris/models/authorization.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ToolbarWidget extends StatelessWidget {
  const ToolbarWidget({super.key});

  @override
  Widget build(BuildContext context) {

    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        TextButton(
          style: ButtonStyle(
              splashFactory: NoSplash.splashFactory,
              overlayColor: MaterialStateProperty.all(Colors.transparent)),
          onPressed: () async {
            context.go("/admin/main");
          },
          child: const Text(
            "控制台",
            style: TextStyle(
                color: Colors.black, fontWeight: FontWeight.w500, fontSize: 16),
          ),
        ),
        FutureBuilder<AuthorizationModel?>(
            future: AuthorizationStore
                .findCurrent(), // IsarStore.findAuthorization(),
            builder: (BuildContext context, AsyncSnapshot snapshot) {
              if (snapshot.connectionState == ConnectionState.done) {
                if (snapshot.hasError) {
                  // 请求失败，显示错误
                  debugPrint("Error: ${snapshot.error}");
                  return Text("Error: ${snapshot.error}");
                } else {
                  // 请求成功，显示数据
                  var auth = snapshot.data as AuthorizationModel?;
                  if (auth != null) {
                    return TextButton(
                      style: ButtonStyle(
                          splashFactory: NoSplash.splashFactory,
                          overlayColor:
                              MaterialStateProperty.all(Colors.transparent)),
                      onPressed: () async {
                        // todo 取消以下注释并修复错误
                        //context.go(WebRoutePath.articleCreatePath);
                      },
                      child: Text(
                        "你好，${auth.accessToken}",
                        style: const TextStyle(
                            color: Colors.black,
                            fontWeight: FontWeight.w500,
                            fontSize: 16),
                      ),
                    );
                  }
                  return TextButton(
                    style: ButtonStyle(
                        splashFactory: NoSplash.splashFactory,
                        overlayColor:
                            MaterialStateProperty.all(Colors.transparent)),
                    onPressed: () async {
                      // todo 取消以下注释并修复错误
                      //context.go(WebRoutePath.accountLoginPath);
                    },
                    child: const Text(
                      "登录",
                      style: TextStyle(
                          color: Colors.black,
                          fontWeight: FontWeight.w500,
                          fontSize: 16),
                    ),
                  );
                }
              } else {
                // 请求未结束，显示loading
                return Container();
              }
            })
      ],
    );
  }
}
