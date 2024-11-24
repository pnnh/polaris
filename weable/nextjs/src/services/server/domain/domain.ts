import {RemoteDomain} from "@/services/server/domain/remote";
import {serverConfig} from "@/services/server/config";
import parseUri from "parse-uri";

export interface IDomain {
    makeGet<T>(url: string): Promise<T>

    makePost<T>(url: string, params: unknown): Promise<T>
}

export function trySigninDomain(): IDomain | undefined {
    const initialDomains = serverConfig.INITIAL_DOMAINS
    const domainUrl = parseUri(initialDomains)
    const systemDomain = new RemoteDomain(domainUrl)
    return systemDomain
}

export function signinDomain(): IDomain {
    const domain = trySigninDomain()
    if (!domain) {
        throw new Error('domain not found')
    }
    return domain
}
