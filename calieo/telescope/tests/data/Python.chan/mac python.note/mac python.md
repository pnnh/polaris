---
image: cover.webp
---

任何将macOS更新到Monterey 12.3的人都会发现他们突然不再提供Python 2的系统。
这样做的原因是Apple删除了系统提供的python 2安装（详细信息）。
因此，解决此问题/解决方案是使用pyenv安装python 2.7（或您需要的任何其他特定版本）。
1. 安装 with 以管理不同的 python 版本：pyenvbrewbrew install pyenv
2. 列出所有可安装版本pyenv install --list
3. 安装 python 2.7.18pyenv install 2.7.18
4. 列出已安装的版本pyenv versions
5. 设置全局 python 版本pyenv global 2.7.18
6. 添加到（或 或 ，根据需要添加）eval "$(pyenv init --path)"~/.zprofile~/.bash_profile~/.zshrc
7. 重新启动 shell 并检查 python 是否正常工作。


通过执行 pyenv local 2.7.18 来在当前shell初始化 python 2.7.18 环境