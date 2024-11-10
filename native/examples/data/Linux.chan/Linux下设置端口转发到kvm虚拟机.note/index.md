---
image: cover.webp
---


### 命令如下

假设虚拟机ip是192.168.122.79

```bash
sudo iptables -t nat -A PREROUTING -p tcp --dport 3389 -j DNAT --to-destination 192.168.122.79:3389

sudo iptables -t nat -A POSTROUTING -p tcp --dport 3389 -d 192.168.122.79 -j SNAT --to 192.168.122.1
```

需要删除两个转发规则

```bash
# 删除前执行命令查看情况
azureuser@develop ~ sudo iptables -nL -v --line-numbers -t filter
Chain INPUT (policy ACCEPT 0 packets, 0 bytes)
num   pkts bytes target     prot opt in     out     source               destination
1    2089K 6859M LIBVIRT_INP  all  --  *      *       0.0.0.0/0            0.0.0.0/0

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
num   pkts bytes target     prot opt in     out     source               destination
1     231K 1200M DOCKER-USER  all  --  *      *       0.0.0.0/0            0.0.0.0/0
2     231K 1200M DOCKER-ISOLATION-STAGE-1  all  --  *      *       0.0.0.0/0            0.0.0.0/0
3        0     0 ACCEPT     all  --  *      docker0  0.0.0.0/0            0.0.0.0/0            ctstate RELATED,ESTABLISHED
4        0     0 DOCKER     all  --  *      docker0  0.0.0.0/0            0.0.0.0/0
5        0     0 ACCEPT     all  --  docker0 !docker0  0.0.0.0/0            0.0.0.0/0
6        0     0 ACCEPT     all  --  docker0 docker0  0.0.0.0/0            0.0.0.0/0
7     231K 1200M LIBVIRT_FWX  all  --  *      *       0.0.0.0/0            0.0.0.0/0
8     231K 1200M LIBVIRT_FWI  all  --  *      *       0.0.0.0/0            0.0.0.0/0
9    73318   36M LIBVIRT_FWO  all  --  *      *       0.0.0.0/0            0.0.0.0/0

Chain OUTPUT (policy ACCEPT 0 packets, 0 bytes)
num   pkts bytes target     prot opt in     out     source               destination
1    2289K 1209M LIBVIRT_OUT  all  --  *      *       0.0.0.0/0            0.0.0.0/0

Chain DOCKER (1 references)
num   pkts bytes target     prot opt in     out     source               destination

Chain DOCKER-ISOLATION-STAGE-1 (1 references)
num   pkts bytes target     prot opt in     out     source               destination
1        0     0 DOCKER-ISOLATION-STAGE-2  all  --  docker0 !docker0  0.0.0.0/0            0.0.0.0/0
2     231K 1200M RETURN     all  --  *      *       0.0.0.0/0            0.0.0.0/0

Chain DOCKER-ISOLATION-STAGE-2 (1 references)
num   pkts bytes target     prot opt in     out     source               destination
1        0     0 DROP       all  --  *      docker0  0.0.0.0/0            0.0.0.0/0
2        0     0 RETURN     all  --  *      *       0.0.0.0/0            0.0.0.0/0

Chain DOCKER-USER (1 references)
num   pkts bytes target     prot opt in     out     source               destination
1     231K 1200M RETURN     all  --  *      *       0.0.0.0/0            0.0.0.0/0

Chain LIBVIRT_FWI (1 references)
num   pkts bytes target     prot opt in     out     source               destination
1     158K 1164M ACCEPT     all  --  *      virbr0  0.0.0.0/0            192.168.122.0/24     ctstate RELATED,ESTABLISHED
2        0     0 REJECT     all  --  *      virbr0  0.0.0.0/0            0.0.0.0/0            reject-with icmp-port-unreachable

Chain LIBVIRT_FWO (1 references)
num   pkts bytes target     prot opt in     out     source               destination
1    73318   36M ACCEPT     all  --  virbr0 *       192.168.122.0/24     0.0.0.0/0
2        0     0 REJECT     all  --  virbr0 *       0.0.0.0/0            0.0.0.0/0            reject-with icmp-port-unreachable

Chain LIBVIRT_FWX (1 references)
num   pkts bytes target     prot opt in     out     source               destination
1        0     0 ACCEPT     all  --  virbr0 virbr0  0.0.0.0/0            0.0.0.0/0

Chain LIBVIRT_INP (1 references)
num   pkts bytes target     prot opt in     out     source               destination
1     1331 91193 ACCEPT     udp  --  virbr0 *       0.0.0.0/0            0.0.0.0/0            udp dpt:53
2        9   456 ACCEPT     tcp  --  virbr0 *       0.0.0.0/0            0.0.0.0/0            tcp dpt:53
3       12  4058 ACCEPT     udp  --  virbr0 *       0.0.0.0/0            0.0.0.0/0            udp dpt:67
4        0     0 ACCEPT     tcp  --  virbr0 *       0.0.0.0/0            0.0.0.0/0            tcp dpt:67

Chain LIBVIRT_OUT (1 references)
num   pkts bytes target     prot opt in     out     source               destination
1        0     0 ACCEPT     udp  --  *      virbr0  0.0.0.0/0            0.0.0.0/0            udp dpt:53
2        0     0 ACCEPT     tcp  --  *      virbr0  0.0.0.0/0            0.0.0.0/0            tcp dpt:53
3       12  4008 ACCEPT     udp  --  *      virbr0  0.0.0.0/0            0.0.0.0/0            udp dpt:68
4        0     0 ACCEPT     tcp  --  *      virbr0  0.0.0.0/0            0.0.0.0/0            tcp dpt:68

```

最终执行了以下命令删除规则

```bash

sudo iptables -D LIBVIRT_FWI 2 -t filter
sudo iptables -D LIBVIRT_FWO 2 -t filter

```
