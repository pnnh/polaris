FROM postgres:16 AS base

WORKDIR /app
COPY . .
RUN chmod +x init.sh
# 将初始化脚本复制到 postgres 初始化目录，容器首次启动时会自动执行
RUN cp init.sh /docker-entrypoint-initdb.d/10_init.sh

USER postgres