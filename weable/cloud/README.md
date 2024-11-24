一个.NET 7.0示例项目，再尝试写点东西


### 编译构建

这里target目录定为输出目录

```shell
# 服务端构建
dotnet publish -c Release Polaris.sln
```

## 构建docker镜像

```bash
sudo docker build -t polaris-cloud-server .

# 本地测试运行容器
sudo docker run --env-file=debug/.env -p 8101:8101 polaris-cloud-server

# 镜像打标签
sudo docker tag polaris-cloud-server:latest elarry/polaris-cloud-server:v0.1.0

# 推送镜像（需要先登录）
sudo docker push elarry/polaris-cloud-server:v0.1.0
```