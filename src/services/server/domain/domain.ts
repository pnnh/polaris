import {RemoteDomain} from "@/services/server/domain/remote";
import {IDomain} from "@/services/common/domain";

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
    const workerUrl = "http://127.0.0.1:7101"
    const domain = trySigninDomain(workerUrl)
    if (!domain) {
        throw new Error('domain not found')
    }
    return domain
}

export function serverSigninDomain2(): IDomain {
    const serverUrl = "http://127.0.0.1:8001"
    const domain = trySigninDomain(serverUrl)
    if (!domain) {
        throw new Error('domain not found')
    }
    return domain
}