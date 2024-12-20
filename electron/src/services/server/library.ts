import {SystemLibraryService} from "@pnnh/polaris-business";
import {serverGetDomainPath} from "@/services/server/domain";

export async function serverSelectLibraries() {
    const domainUrl = serverGetDomainPath()

    const service = new SystemLibraryService(domainUrl)

    return await service.selectLibraries()
}
