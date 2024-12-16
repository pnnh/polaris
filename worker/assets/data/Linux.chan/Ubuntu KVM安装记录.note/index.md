

### 更新到最新系统

```bash
sudo apt update
```

### 检查是否支持硬件虚拟化

```bash

# 如果返回值大于0，说明支持硬件虚拟化
egrep -c '(vmx|svm)' /proc/cpuinfo

```

若显示不支持，则可能是因为BIOS中没有开启，需要进入BIOS开启虚拟化

### 安装KVM

首先检查kvm是否已经在运行：

```bash
# 安装cpu-checker
sudo apt install cpu-checker

# 检查kvm是否已经在运行
kvm-ok
```

如果没有运行，可以通过以下命令安装：

```bash
# 安装kvm
sudo apt install qemu-kvm
# 为运行libvirt进程提供必要的配置
sudo apt install libvirt-daemon-system
# 客户端的库和API，可以从命令行管理和控制虚拟机和管理程序
sudo apt install libvirt-clients 
# 创建和管理桥接设备的工具
sudo apt install bridge-utils
# 图形界面虚拟机管理工具
sudo apt install virt-manager 
# 为置备和修改虚拟机提供的命令行工具
sudo apt install virtinst
```

### 启动虚拟化服务

```bash
# 配置开机启动
sudo systemctl enable --now libvirtd
# 手动启动libvirtd服务
sudo systemctl start libvirtd
# 检查libvirtd服务是否已经启动
sudo systemctl status libvirtd
```

将用户添加到libvirt组，以便用户可以管理虚拟机

```bash
sudo usermod -aG kvm $USER
sudo usermod -aG libvirt $USER
```

之后就可以通过virt-manager图形化工具来管理虚拟机了