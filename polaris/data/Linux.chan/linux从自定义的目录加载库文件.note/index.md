---
image: cover.webp
---

您应该添加有关您的发行版的更多详细信息，例如在Ubuntu下，正确的方法是将自定义文件添加到，例如.conf/etc/ld.so.conf.d

sudo gedit /etc/ld.so.conf.d/randomLibs.conf
在文件中，您应该将完整路径写入包含要添加到系统中的所有库的目录，例如

/home/linux/myLocalLibs
请记住仅将路径添加到dir，而不是文件的完整路径，该路径中的所有库都将自动编制索引。

保存并运行以使用此库更新系统。sudo ldconfig

或者以下方式，但似乎这种方式对图形程序无效

保留前面的路径，不要覆盖它：

export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/your/custom/path/
您可以将其添加到您的：~/.bashrc

echo 'export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/your/custom/path/' >> ~/.bashrc

