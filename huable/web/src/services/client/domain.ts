import parseUri, {URI} from "parse-uri";
import parseURI from "parse-uri"
import {IDomain} from "@/services/common/domain";
import {useServerConfig} from "@/services/server/config";
import {ClientConfig} from "@/services/client/config";

export class RemoteDomain implements IDomain {
    userUri: parseURI.URI
    baseUrl: string

    constructor(userUri: parseURI.URI) {
        this.userUri = userUri

        this.baseUrl = userUri.source
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

export function clientSigninDomain(clientConfig: ClientConfig): IDomain {
    const domain = trySigninDomain(clientConfig.defaultDomain.baseurl)
    if (!domain) {
        throw new Error('domain not found')
    }
    return domain
}
