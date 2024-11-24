## 构建docker镜像

```bash
sudo docker build -t venus-nextjs .

# 本地测试运行容器
sudo docker run --env-file debug/.env -p 8100:8100 venus-nextjs
```
