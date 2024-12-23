import {SystemFileService} from "../src/server/personal/file";

async function main() {
    const pathUrl = 'file://~'
    const service = new SystemFileService()
    const result = await service.selectFiles(pathUrl, undefined)
    for (const file of result.data.range) {
        console.log('selectFile', file)
    }
}

main().then(() => {
    console.log('done')
})
