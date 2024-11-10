
```bash
# 构建镜像
docker build -t custom-mysql -f Dockerfile .
# 执行容器
docker run -p 3306:3306 --name custom-mysql -d custom-mysql:latest
```