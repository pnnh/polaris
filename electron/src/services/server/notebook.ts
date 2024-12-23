import {ISelectFilesOptions, SystemFileService} from "@pnnh/polaris-business";
import {serverGetDomainPath} from "@/services/server/domain";

export async function serverSelectFiles(event: Electron.Event, parentPath: string, options: ISelectFilesOptions | undefined) {
    const domainUrl = serverGetDomainPath()

    const service = new SystemFileService()

    return await service.selectFiles(parentPath, options)
}
