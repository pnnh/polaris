---
image: cover.jpg
---

emacs支持作为守护进程启动，然后通过emacsclient进行链接，这样的话可以加快编辑器启动速度

但是估计是因为用户权限原因，守护进程和emacsclient似乎是一对一的，跟每个用户账号有关系

所以在ubuntu下，root用户和常规用户似乎要启动两个emacs守护实例


### 常规用户启动emacs守护进程

创建以下文件

~/.config/systemd/user/emacs.service

```bash

[Unit] 
Description=Emacs text editor 
Documentation=info:emacs man:emacs(1) https://gnu.org/software/emacs/ 
 
[Service] 
Type=forking 
ExecStart=/usr/bin/emacs --daemon 
ExecStop=/usr/bin/emacsclient --eval "(kill-emacs)" 
Environment=SSH_AUTH_SOCK=%t/keyring/ssh 
Restart=on-failure 
 
[Install] 
WantedBy=default.target

```

然后执行systemctl命令来启动服务并设置开机启动，注意添加--user参数

```bash
systemctl enable --user emacs
systemctl start --user emacs
```

### root用户启动emacs守护进程

创建以下文件

/etc/systemd/system/emacs.service

```bash
[Unit] 
Description=Emacs text editor 
Documentation=info:emacs man:emacs(1) https://gnu.org/software/emacs/ 
 
[Service] 
Type=forking 
ExecStart=/usr/bin/emacs --daemon 
ExecStop=/usr/bin/emacsclient --eval "(kill-emacs)" 
Environment=SSH_AUTH_SOCK=%t/keyring/ssh 
Restart=on-failure 
 
[Install] 
WantedBy=default.target

```

然后执行systemctl命令来启动服务并设置开机启动，不用添加-user参数

```bash

sudo systemctl enable emacs

sudo systemctl start emacs

```

之后可以通过emacsclient来链接守护进程，示例如下

```bash
emacsclient -nw # 打开新的emacsclient窗口
emacsclient <filename> # 打开指定文件
```

为方便起见可以设置bash alias，注意需要为普通用户和root用户分别设置

```bash
alias ems='emacs -nw'
alias emc='emacsclient -nw'
alias emw='emacsclient --create-frame'
alias emacs='emacs -nw'
```
