
import {SystemFileService} from "../src/server/personal/file";
import path from "path";

async function main() {
    const currentDir = path.join(process.cwd(), 'data')
    console.log('Current directory:', currentDir)
    const service = new SystemFileService(currentDir)
    const result = await service.selectFiles('')
    console.log('selectFiles', result)
}

main().then(() => {
    console.log('done')
})
