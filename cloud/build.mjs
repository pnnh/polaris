#!/usr/bin/env -S deno run --allow-env --allow-run --allow-read --allow-write

import { $, cd } from 'https://deno.land/x/zx_deno/mod.mjs'
await $`date`

console.log('hello deno')

async function buildPolaris(projectName) {
    // // 构建应用
    // await $`ls -la ${projectName}`
    // await $`mkdir -p ${projectName}build`
    // await $`dotnet restore ${projectName}/Polaris.csproj`
    // await $`dotnet build ${projectName}/Polaris.csproj -c Release -o ${projectName}/build`
    // await $`mkdir -p ${projectName}/publish`
    // await $`dotnet publish ${projectName}/Polaris.csproj -c Release -o ${projectName}/publish`

    // // 构建镜像
    // await $`docker build -t polaris-server -f ${projectName}/Dockerfile ${projectName}`

    // // 集成环境下重启容器
    // await $`docker rm -f polaris-server`
    // await $`docker run -d --restart=always \
    //         --name polaris-server \
    //         -p 8101:8101 \
    //         polaris-server`

    // 构建应用
    await cd(projectName, { quiet: false })
    await $`ls -la`
    await $`mkdir -p build`
    await $`dotnet restore Polaris.csproj`
    await $`dotnet build Polaris.csproj -c Release -o build`
    await $`mkdir -p publish`
    await $`dotnet publish Polaris.csproj -c Release -o publish`

    // 构建镜像
    await $`docker build -t polaris-server -f Dockerfile .`

    // 集成环境下重启容器
    await $`docker rm -f polaris-server`
    await $`docker run -d --restart=always \
            --name polaris-server \
            -p 8101:8101 \
            polaris-server`
}

await buildPolaris('Polaris')