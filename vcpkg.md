## about vcpkg baseline

repo: github.com/microsoft/vcpkg
baseline: 5f4628b89f3f98cd9a0b43c27ded2aa53da1f790

```bash
git show 5f4628b89f3f98cd9a0b43c27ded2aa53da1f790:versions/baseline.json|egrep -A 3 -e '"boost"'
```

### folly

似乎folly太新的版本会编译出错，需要指定版本
因为folly依赖libsodium、zlib所以添加到vcpkg.json中

### qt

依赖Qt是因为linux下客户端需要使用