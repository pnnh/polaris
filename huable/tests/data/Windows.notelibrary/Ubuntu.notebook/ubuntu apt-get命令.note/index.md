# 查看某一个包的详细版本
apt-cache madison vim 
# 更新源
sudo apt-get update
# 列出某个包的安装策略
apt-cache policy vim 
# 列出某个包的所有来源
sudo apt-cache showpkg vim 
# 模拟安装软件
sudo apt-get install -s vim  

# 安装包
sudo apt-get install package
# 列出包的版本
sudo apt-show-versions -a vim

# 查询指定包的详情
apt-cache show package  

# 显示已安装包的详情
dpkg -s package  

# 查看文件属于哪个包
sudo dpkg -S whereis
sudo dpkg-query -S /usr/bin/whereis  

# 搜索文件属于哪个包
apt-file search makeinfo  

# 显示该包被哪项包依赖
apt-cache rdepends pkg    

# 添加ppa源
sudo add-apt-repository ppa:git-core/ppa 
# 删除ppa源
sudo add-apt-repository -r ppa:user/ppa-name
