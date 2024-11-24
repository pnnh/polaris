import {$, cd} from 'zx'

await $`date`

async function buildVenus() {
    // 构建应用
    await $`npm install`
    await $`npm run build`
    await $`docker build -t venus-nextjs -f Dockerfile .`

    // 集成环境下重启容器
    await $`docker rm -f venus-nextjs`
    await $`docker run -d --restart=always \
            --name venus-nextjs \
            -p 8200:8200 \
            venus-nextjs`
}

await buildVenus()
