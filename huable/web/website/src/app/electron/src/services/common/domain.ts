import {RemoteDomain} from "@/services/common/remote";
import parseUri, {URI} from "parse-uri";

export interface IDomain {
    makeGet<T>(url: string): Promise<T>

    makePost<T>(url: string, params: unknown): Promise<T>

    makePut<T>(url: string, params: unknown): Promise<T>
}

export async function trySigninDomain(domainUrl: string): Promise<IDomain | undefined> {
    let remoteUri: URI
    remoteUri = parseUri(domainUrl)
    return new RemoteDomain(remoteUri)
}

