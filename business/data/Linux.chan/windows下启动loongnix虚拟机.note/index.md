---
image: cover.webp
---

### 下载软件和系统映像

下载QEMU，地址：https://qemu.weilnetz.de/w64/2024/qemu-w64-setup-20240411.exe
安装后将安装目录加入到系统Path环境变量

下载引导固件，地址：https://mirrors.wsyu.edu.cn/loongarch/archlinux/images/QEMU_EFI_8.1.fd

下载loongnix社区预制系统，地址：https://pkg.loongnix.cn/loongnix/isos/Loongnix-20.5/Loongnix-20.5.mate.mini.loongarch64.en.qcow2

### 启动虚拟机

假设下载的固件文件和预制系统存储在E:\Machines\Loongnix目录

将以下内容保存为E:\Machines\Loongnix\LAStartup.ps1

```bash
qemu-system-loongarch64  -m 8G -cpu la464-loongarch-cpu `
	-machine virt -smp 4 -bios ./QEMU_EFI_8.1.fd -serial stdio `
	-device virtio-gpu-pci -net nic -net user `
	-device nec-usb-xhci,id=xhci,addr=0x1b `
	-device usb-tablet,id=tablet,bus=xhci.0,port=1 `
	-device usb-kbd,id=keyboard,bus=xhci.0,port=2 `
	-hda ./Loongnix-20.5.mate.mini.loongarch64.en.qcow2

```

首先启动powershell并进入以上目录后执行

```bash
PS E:\Machines\Loongnix> .\LAStartup.ps1
This may indicate that pixbuf loaders or the mime database could not be found.
Entering C environment
SecCoreStartupWithStack (0x1C000000, 0x90000)
(0x10000, 0x80000)
&SecCoreData.BootFirmwareVolumeBase=8FF98 SecCoreData.BootFirmwareVolumeBase=1C000000
&SecCoreData.BootFirmwareVolumeSize=8FFA0 SecCoreData.BootFirmwareVolumeSize=3A0000
Find Pei EntryPoint=1C00F240
SecStartupPhase2 1C00F240
Register PPI Notify: DCD0BE23-9586-40F4-B643-06522CED4EDE
Install PPI: 8C8CE578-8A3D-4F1C-9935-896185C32DD3
Install PPI: 5473C07A-3DCB-4DCA-BD6F-1E9689E7349A
The 0th FV start address is 0x0001C000000, size is 0x003A0000, handle is 0x1C000000
Register PPI Notify: 49EDB1C1-BF21-4761-BB12-EB0031AABB39
....
```

默认用户密码为: root Loongson20 

自己执行时遇到了
error: no suitable video mode found.
错误

未深入研究去解决，控制台界面可以正常登录
