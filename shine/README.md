尝试用Rust编写Server

### 构建

```shell
# debug构建
cargo build --bin proxima
# release构建
cargo build --release --bin proxima 
# 执行
cargo run --bin proxima
```

### 构建docker镜像

```bash
# 复制二进制文件到docker目录
cp target/release/proxima docker
# 复制资产到docker目录
cp -r assets docker
# 构建docker镜像
cd docker
sudo docker build -f Dockerfile -t dream-proxima:latest .
# 测试执行构建的镜像
sudo docker run -p 8090:8080 dream-proxima
# 仅在本地测试时使用，将aws凭证文件挂载到docker容器
sudo docker run -p 8090:8080 -v $HOME/.aws/credentials:/root/.aws/credentials:ro dream-proxima
```
