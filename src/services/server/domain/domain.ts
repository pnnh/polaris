import {RemoteDomain} from "@/services/server/domain/remote";
import {IDomain} from "@/services/common/domain";
import {useServerConfig} from "@/services/server/config";

function trySigninDomain(domainUrl: string | undefined = ""): IDomain | undefined {
    const systemDomain = new RemoteDomain(domainUrl)
    return systemDomain as IDomain
}

export function serverPortalSignin(): IDomain {
    const serverConfig = useServerConfig()
    const serverUrl = serverConfig.PUBLIC_PORTAL_URL
    const domain = trySigninDomain(serverUrl)
    if (!domain) {
        throw new Error('domain not found')
    }
    return domain
}
