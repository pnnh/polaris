---
image: cover.webp
---

查看因OOM被kill掉的进程记录
grep -i 'killed process' /var/log/messages  
dmesg | egrep -i 'killed process'

As I understand, the size of the virtual memory that a process uses is listed as "total-vm". Part of it is really mapped into the RAM itself (allocated and used). This is "RSS".
Part of the RSS is allocated in real memory blocks (other than mapped into a file or device). This is anonymous memory ("anon-rss") and there is also RSS memory blocks that are mapped into devices and files ("file-rss”).


Bash
普通用户：
export PS1='\[\033[01;32m\]\u@\h\[\033[01;34m\] \W \[\033[00m\]'
root:
export PS1="\[\033]0;\u@\h:\w\007\]\[\033[01;31m\]\u@\h\[\033[01;34m\] \W \[\033[00m\]”
磁盘状态命令
vmstat
iostat
sar
du -h --max-depth=1


加载内核模块
modprobe  dm_thin_pool
列出内核模块
lsmod|grep dm_

ps aux | grep java
