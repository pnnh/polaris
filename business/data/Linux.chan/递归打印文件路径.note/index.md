---
image: cover.jpg
---


tree命令输出的是经过格式化的文件路径信息，如下所示

```bash
larry@larry-pc:~$ tree
.
├── bin
│   ├── drivers
│   ├── nxagent
│   ├── nxauth
│   ├── nxkb
│   └── nxusbd
├── etc
│   ├── core
│   ├── keys
│   │   ├── host
│   │   │   ├── nx_host_rsa_key
│   │   │   └── nx_host_rsa_key.crt
│   │   ├── node.localhost.id_dsa
│   ├── node.cfg
│   ├── node-debian.cfg.sample
│   ├── node-mandriva.cfg.sample

```

但有时我们希望递归得打印所有子文件的完整路径，此时可以使用find命令

```bash
larry@larry-pc:~/下载/nomachine_8.4.2_1_x86_64/NX$ sudo find .
.
./etc
./etc/update.cfg
./etc/version
./etc/keys
./etc/keys/node.localhost.id_rsa
./etc/keys/node.localhost.id_rsa.pub
./etc/node-redhat.cfg.sample
./etc/node-fedora.cfg.sample
./scripts
./scripts/selinux
./scripts/selinux/nx-unconfined-fedora24.pp
./scripts/selinux/fedora25
./scripts/selinux/fedora25/nx-unconfined.pp
./scripts/selinux/nx.pp
./scripts/selinux/nx-unconfined.pp
./scripts/selinux/nx-system.pp
./scripts/setup
./scripts/setup/nxrunner
./scripts/setup/install
./scripts/restricted/nxcopy.sh
./scripts/restricted/nxquotaadd.sh
./scripts/restricted/nxpasswd.sh
./scripts/etc
./scripts/etc/localhost
./scripts/etc/localhost/runner.cfg
./scripts/etc/pam.d/nx
./scripts/etc/pam.d/nx-login
./scripts/etc/pam.d/nx-legacy
./scripts/etc/nxnode
./scripts/etc/nxserver
./scripts/env/nxcustomerrormessages.sh
./scripts/env/nxpreload.sh
./scripts/env/forcelogout.sh
./scripts/env/nxvdvariables.sh
```

