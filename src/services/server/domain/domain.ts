import {RemoteDomain} from "@/services/server/domain/remote";
import {useServerConfig} from "@/services/server/config";

export async function serverPortalSignin(): Promise<RemoteDomain> {
    const serverConfig = await useServerConfig()
    const serverUrl = serverConfig.PUBLIC_PORTAL_URL
    const domain = new RemoteDomain(serverUrl)
    if (!domain) {
        throw new Error('domain not found')
    }
    return domain
}
