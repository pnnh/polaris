笔记服务Web站点

### 构建Docker镜像

```bash
# 构建docker镜像
docker build --progress=plain -t polaris .
# 为docker镜像打标签
docker tag polaris elarry/polaris:v0.2.0
# 登录dockerhub
docker login
# 推送docker镜像
docker push elarry/polaris:v0.2.0
```

### 测试相关

```bash
# 构建测试镜像
docker build -t polaris-testing  --progress=plain -f Testing.Dockerfile .
```
