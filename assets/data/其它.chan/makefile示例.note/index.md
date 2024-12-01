---
image: cover.jpg
---

以下为markfile示例，演示构建过程

命令前面的-表示忽略错误，即使命令执行失败，也不会终止整个构建过程

```makefile

all : release

DIR := $(CURDIR)

setup :
	-mkdir $(DIR)/build
	-mkdir $(DIR)/product

assets : setup
	-cd $(DIR) && cp -r assets product

release : assets
	-cd $(DIR)/build && -cmake -DCMAKE_BUILD_TYPE=Debug -G Ninja .. && -ninja

debug : assets
	-cd $(DIR)/build && -cmake -DCMAKE_BUILD_TYPE=Debug -G Ninja .. && -ninja

image : release
	docker build -f docker/Dockerfile -t dream-kepler:latest .

clean :
	-rm -f ./target

```