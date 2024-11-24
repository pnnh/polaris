import { $, cd } from 'zx'

await $`date`

async function buildPolaris() {
    // 构建应用
    await $`npm install`
    await $`npm run build`
    await $`docker build -t venus-worker -f Dockerfile .`

    // 集成环境下重启容器
    await $`docker rm -f venus-worker`
    await $`docker run -d --restart=always \
            --name venus-worker \
            -v /home/azureuser/projects/weable/album:/data/album \
            -p 8202:8202 \
            venus-worker`
}

await buildPolaris()
