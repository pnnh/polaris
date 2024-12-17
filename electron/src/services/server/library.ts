
import {SystemLibraryService} from "@pnnh/polaris-business";
import {serverConfig} from "@/services/server/config";

export async function serverSelectLibraries() {
    const domainUrl = serverConfig.INITIAL_DOMAINS

    const service = new SystemLibraryService(domainUrl)

    return  await service.selectLibraries()
}
