
需要在powershell下执行

添加端口转发
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=2022 connectaddress=172.24.39.57 connectport=2022  protocol=tcp

查看转发规则
netsh interface portproxy show v4tov4

删除转发规则
netsh interface portproxy delete v4tov4  listenaddress=0.0.0.0 listenport=2022 protocol=tcp

开启本地防火墙
netsh advfirewall firewall add rule name="Open Port 2022 for WSL2" dir=in action=allow protocol=TCP localport=2022


为什么WSL2分配固定IP

powershell执行
netsh interface ip add address "vEthernet (WSL)" 172.24.39.1 255.255.0.0

wsl2内执行
sudo ip addr add 172.24.39.57/16 broadcast 172.24.39.255 dev eth0 label eth0:1
