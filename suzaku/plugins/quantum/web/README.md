个人博客站点前端部分代码

为单页应用程序，托管在主域名/u目录下

处理一些无需首屏优化和SEO的页面呈现

本程序在开发时通过vite托管，生产环境通过express托管

主域名并不直接指向本程序，而是指向Go服务程序

开发阶段通过302跳转至本程序，生产阶段通过CDN路径匹配定向回源

在本地模拟生产环境资源托管
```shell
# 在根目录下监听
http-server ./ --port=3600 --cors
```

## 手动进行brotli压缩

```shell
npm i -g brotli-cli   # 安装压缩工具
brotli-cli compress qt-canvas.wasm
```

## 可以通过以下命令分割wasm文件
将wasm文件拆分后，再分别进行br压缩。从服务器并行下载到浏览器再做合并，可以提高下载速度。

```shell
split -b 5m qt-canvas.wasm qt-canvas.wasm.  # 会生成.aa .ab .ac 类似的文件
```

如果将分割后的文件大小控制在10m以内，并在上传至s3时修改下Content-Type类型为text/plain，则CloudFront将会自动进行br压缩

不过这种做法的话文件实际类型和返回的Content-Type不符，需要在js中通过xhr手动获取，并做文件合并

经过最终试验，CloudFront似乎没有对用户单个链接做速度限制，所以直接将21m文件br压缩后下载，和分割成多个文件再压缩后下载，所花的时间差不多

甚至通过xhr方式下载文件，在Firefox下面不会走缓存，而直接GET方式下载wasm第二次请求会缓存

## 更新依赖包版本

```shell
npm update    # 更新依赖包版本
npm outdated  # 检测是否有过时的包
npm install # 安装依赖包
```
