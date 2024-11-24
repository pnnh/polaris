---
image: cover.jpg
---

尝试在linux下安装aws-sdk-cpp，并用在cmake项目里

但是实际上很不顺利，尝试了vcpkg、xmake、ubuntu自带的apt、以及nixpkgs包管理工具

当然还尝试了，通过cmake FetchContent的形式来管理aws-sdk-cpp

但是，这个sdk源码量太多了，编译十分耗时。所以通过FetchContent或者cmake外部工程的形式，编译耗时太久了。不过应该可行。

想尝试简便一些的办法，用一些包管理工具。ubuntu官方源里是没有aws-sdk-cpp的，所以只能跳过。

首先试了xmake，它声称有自己的官方源，并可以试用vcpkg的源。不过找个spdlog库试了下，直接通过vcpkg命令可以安装并编译成功，但是通过xmake引用vcpkg的源没有成功。
好在xmake官方源里也提供了spdlog，试了下直接引用官方源可以构建并编译成功。

不过我需要的不只是spdlog，而是aws-sdk-cpp。这个在xmake官方源里没有，在vcpkg源里有。因为有了前面xmake引用vcpkg源里spdlog未成功的示例，所以这次抛开xmake工具直接使用vcpkg工具链。

在vcpkg工具链下，安装成功了aws-sdk-cpp，不过它只带了s3、dynamodb等很少的几个子组件，也就是说它是不完整的。s3的示例可以成功，但是还需要appconfig和appconfigdata的组件，所以只能放弃vcpkg。

接下来试了nixpkgs，它号称可以跨平台管理linux和mac的包，并且官方仓库的包非常多。试了下，可以安装aws-sdk-cpp，功能似乎也是完整的。但是，nixpkgs是一个非常个性的包管理工具。它默认会把所有包都安装在/nix目录下，通过不同的hash作为名字来管理安装的包。完全没有使用linux一贯的目录风格。安装好包之后，会在~/.nix-profile目录下创建一些快捷链接。不过似乎只对可执行程序、库文件等做了处理，没处理cmake的FindXXX.cmake等之类的文件。并且也无法设置CMAKE_PREFIX_PATH，因为并不能确切的知道每个包安装的目录。

nixpkgs官方是有个方案的，通过在工程目录下设置一个shell.nix文件，再通过nix-shell命令进入一个新的终端环境，它就会设置好各种依赖，这时候CMAKE_PREFIX_PATH等环境变量也能自动设置好。这个也是nixpkgs官方标榜的功能，可以创建一个随时可以恢复的开发环境。或许最终在这个nix-shell新启的环境里能构建成功，不过我没有继续尝试。因为这种做法对IDE不太友好。同时有许多外围工具很难做到进入nix-shell提供的环境。所以这条路也行不通。

最后，只得采用最原始的，手动下载aws-sdk-cpp的代码，然后执行cmake .. && ninja && ninja install 等命令了。不过你将CMAKE_INSTALL_PREFIX指定为了/opt目录，也算相对干净了一点吧。

这过程中还遇到了一个Segmentation fault的错误。程序正常编译，且可以运行。不过到aws发起网络请求时发送了段错误被杀掉。通过调试，发现和aws auth 签名方式有关。网上搜索一些资料发现aws在openssl 3.x下面不兼容，甚至有些无法编译通过。

不过你起初怎么编译通过了呢？原来，是因为很早的时候你手动安装过aws-sdk-cpp，所以在/usr/local/lib等目录有一些残留。这时和vcpkg安装的aws-sdk-cpp似乎有些冲突。不过可以编译也可以连接，就是在运行时崩了。当时你手动安装时用的gcc版本和aws-sdk-cpp源码版本肯定没这个新，至于崩溃可能也和这有关系吧。