---
image: cover.jpg
---

安装该辅助工具 https://github.com/dotnet-outdated/dotnet-outdated

### 升级依赖的nuget包版本

解决方案目录下执行，检查过期包  dotnet outdated 

执行```dotnet outdated -u```检查过期包，并更新


#### 升级项目的.net版本

升级项目.net版本，比如从.net 7升级到.net 8

安装升级助手工具
```dotnet tool install -g upgrade-assistant```

在解决方案目录下执行
```upgrade-assistant upgrade```

根据命令提示信息操作

