---
image: cover.webp
---

替换源

homebrew在国内访问都不太顺畅。可以替换成国内中科大的镜像源。
需要替换的是4个模块的镜像： 
Homebrew
Homebrew Core
Homebrew-bottles
Homebrew Cask
具体替换方式如下：
# 替换 Homebrew
git -C "$(brew --repo)" remote set-url origin https://mirrors.ustc.edu.cn/brew.git

# 替换 Homebrew Core
git -C "$(brew --repo homebrew/core)" remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git

# 替换 Homebrew Cask
git -C "$(brew --repo homebrew/cask)" remote set-url origin https://mirrors.ustc.edu.cn/homebrew-cask.git

# 替换 Homebrew-bottles
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles' >> ~/.bash_profile
source ~/.bash_profile
查看源配置
homebrew的配置分成三个目录，分别是
brew（brew --repo）
homebrew/core（brew --repo homebrew/core）
homebrew/cask（brew --repo homebrew/cask）
在目录中可以通过git remote get-url origin来查看当前的源的URL，可以通过以下三个命令设置为默认值，最后不要忘记了更新
git -C "$(brew --repo)" remote set-url origin 'https://github.com/Homebrew/brew.git'

git -C "$(brew --repo homebrew/core)" remote set-url origin 'https://github.com/Homebrew/homebrew-core.git'

git -C "$(brew --repo homebrew/cask)" remote set-url origin 'https://github.com/Homebrew/homebrew-cask.git'

brew update
常用命令
# 更新Homebrew自己
brew update

# 查看哪些包需要更新
brew outdated

# 更新所有的包
brew upgrade

# 更新指定的包
brew upgrade xxx

# 清理所有包的旧版本
brew cleanup

# 清理指定包的旧版本
brew cleanup xxx

# 查看可清理的旧版本包
brew cleanup -n

# 显示某个包的信息
brew info xxx

# 显示所有安装包的信息
brew info

# 查看已安装包的依赖关系
brew deps --installed -tree

# 列出已安装的包
brew list

# 删除某个包
brew remove xxx

# 删除某个包的所有版本
brew uninstall --force xxx

# 搜索软件包的可用版本
brew search xxx
