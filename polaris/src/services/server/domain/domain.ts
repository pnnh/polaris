import {RemoteDomain} from "@/services/server/domain/remote";
import {IDomain} from "@/services/common/domain";
import {mustGetFirstDir, useServerConfig} from "@/services/server/config";

function trySigninDomain(domainUrl: string | undefined = ""): IDomain | undefined {
    const systemDomain = new RemoteDomain(domainUrl)
    return systemDomain as IDomain
}

export function serverMustSigninDomain(domainUrl: string | undefined = ''): IDomain {
    const domain = trySigninDomain(domainUrl)
    if (!domain) {
        throw new Error('domain not found')
    }
    return domain
}

export function serverSigninDomain(): IDomain {
    const serverConfig = useServerConfig()

    const domainUrl = serverConfig.NEXT_PUBLIC_WORKER_URL
    const domain = trySigninDomain(domainUrl)
    if (!domain) {
        throw new Error('domain not found')
    }
    return domain
}
