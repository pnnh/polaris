import {RemoteDomain} from "@/services/server/domain/remote";
import {IDomain} from "@/services/common/domain";
import {useServerConfig} from "@/services/server/config";

function trySigninDomain(domainUrl: string | undefined = ""): IDomain | undefined {
    const systemDomain = new RemoteDomain(domainUrl)
    return systemDomain as IDomain
}

export function serverPhoenixSignin(): IDomain {
    const serverConfig = useServerConfig()
    const workerUrl = serverConfig.PUBLIC_PHOENIX_URL
    const domain = trySigninDomain(workerUrl)
    if (!domain) {
        throw new Error('domain not found')
    }
    return domain
}

export function serverPortalSignin(): IDomain {
    const serverConfig = useServerConfig()
    const serverUrl = serverConfig.PUBLIC_PORTAL_URL + "/portal"
    const domain = trySigninDomain(serverUrl)
    if (!domain) {
        throw new Error('domain not found')
    }
    return domain
}
