---
image: cover.jpg
---


### 查看 Ubuntu 发行版本号

执行以下命令之一：

```bash

lsb_release -a
cat /etc/issue
cat /etc/os-release
cat /etc/debian_version
```

### 查看 Ubuntu 内核版本号

执行以下命令之一：

```bash
uname -a
cat /proc/version
dmesg | grep "Linux"
```
