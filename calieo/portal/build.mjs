#!/usr/bin/env -S deno run --allow-env --allow-run --allow-read --allow-write

import { $, cd } from 'https://deno.land/x/zx_deno/mod.mjs'
await $`date`

console.log('hello deno')

async function buildPolaris() {
    // 构建应用
    await $`ls -la`
    await $`mkdir -p build`
    await $`go mod tidy`
    await $`go build -o build/multiverse-authorization`

    // 构建镜像
    await $`docker build -t multiverse-authorization -f Dockerfile .`
    
    // 集成环境下重启容器
    await $`docker rm -f multiverse-authorization`
    await $`docker run -d --restart=always \
            --name multiverse-authorization \
            -p 8001:8001 \
            multiverse-authorization`
}

await buildPolaris()