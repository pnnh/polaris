import {IDomain} from "@/services/common/domain";
import {ClientConfig} from "@/services/client/config";

export class RemoteDomain implements IDomain {
    baseUrl: string

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    async makeGet<T>(urlString: string) {
        urlString = this.baseUrl + urlString

        const response = await fetch(urlString, {
            credentials: 'include',
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        })
        return response.json()
    }

    async makePost<T>(url: string, params: unknown): Promise<T> {
        url = this.baseUrl + url

        const response = await fetch(url, {
            credentials: 'include',
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        })
        return response.json()
    }

    assetUrl(path: string): string {
        return this.baseUrl + path
    }
}

export function clientTrySigninDomain(domainUrl: string | undefined = ""): IDomain | undefined {
    if (!domainUrl) {
        domainUrl = ""
    }
    const systemDomain = new RemoteDomain(domainUrl)
    return systemDomain as IDomain
}

export function clientMustSigninDomain(domainUrl: string | undefined = ""): IDomain {
    const domain = clientTrySigninDomain(domainUrl)
    if (!domain) {
        throw new Error('clientMustSigninDomain error')
    }
    return domain
}

export function clientSigninDomain(clientConfig: ClientConfig): IDomain {
    const domain = clientTrySigninDomain(clientConfig.SELF_URL)
    if (!domain) {
        throw new Error('domain not found')
    }
    return domain
}
