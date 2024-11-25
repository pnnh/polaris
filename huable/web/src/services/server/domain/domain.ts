import {RemoteDomain} from "@/services/server/domain/remote";
import parseUri, {URI} from "parse-uri";
import {IDomain} from "@/services/common/domain";
import {useServerConfig} from "@/services/server/config";

function trySigninDomain(domainUrl: string): IDomain | undefined {
    let remoteUri: URI
    if (domainUrl.startsWith('http://') || domainUrl.startsWith('https://')) {
        remoteUri = parseUri(domainUrl)
    } else {
        throw new Error('protocol not supported')
    }
    const systemDomain = new RemoteDomain(remoteUri)
    return systemDomain as IDomain
}

export function serverSigninDomain(): IDomain {
    const serverConfig = useServerConfig()
    const initialDomains = serverConfig.INITIAL_DOMAINS
    const domain = trySigninDomain(initialDomains)
    if (!domain) {
        throw new Error('domain not found')
    }
    return domain
}
