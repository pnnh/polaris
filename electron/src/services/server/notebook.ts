
import {serverConfig} from "@/services/server/config";
import {ISelectFilesOptions, SystemFileService} from "@pnnh/polaris-business";

export async function serverSelectFiles(event: Electron.Event, parentPath: string, options: ISelectFilesOptions | undefined) {
    const domainUrl = serverConfig.INITIAL_DOMAINS

    const service = new SystemFileService(domainUrl)

    return await service.selectFiles(parentPath, options)
}
