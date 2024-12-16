---
image: cover.webp
---

Qt官方的MaintenanceTool工具在下载时有时候会出现网络错误，这可能是因为默认源服务器在当前网络环境下线路不稳定，此时可以通过更换镜像源来解决这个问题。

需要通过命令行来启动MaintenanceTool工具，并指定镜像源地址，如下：

```shell
# Linux下
cd ~/Qt  # 进入Qt安装目录
./MaintenanceTool --mirror http://www.nic.funet.fi/pub/mirrors/download.qt-project.org

# macOS下
cd  ~/Qt/MaintenanceTool.app/Contents/MacOS # 进入MaintenanceTool工具目录
./MaintenanceTool --mirror http://www.nic.funet.fi/pub/mirrors/download.qt-project.org
```
