---
image: cover.jpg
---


默认情况下，如果当前没有容器使用卷，则不会删除卷以防止删除重要数据

Docker 现在可以通过一个命令清理一些未用到的资源。

但是要谨慎运行，以免误删数据。详情查看官方文档：https://docs.docker.com/reference/cli/docker/system/prune/

```bash

docker system prune -a --volumes

```