

### folly

似乎folly太新的版本会编译出错，需要指定版本
因为folly依赖libsodium、zlib所以添加到vcpkg.json中

### qt

依赖Qt是因为linux下客户端需要使用