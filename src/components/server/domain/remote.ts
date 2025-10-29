import {cookies} from "next/headers";

export class RemoteDomain {
    baseUrl: string

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    async makeGet<T>(urlString: string) {
        urlString = this.baseUrl + urlString

        const cookieStore = await cookies()
        const authHeader = cookieStore.toString()

        const response = await fetch(urlString, {
            credentials: 'include',
            method: 'GET',
            // cache: 'force-cache',
            // next: {
            //     revalidate: 10, // Revalidate every xx seconds
            // },
            headers: {
                Cookie: authHeader,
                Accept: 'application/json',
            },
        })
        return await response.json() as Promise<T>
    }

    async makePost<T>(url: string, params: unknown): Promise<T> {
        url = this.baseUrl + url

        const cookieStore = await cookies()
        const authHeader = cookieStore.toString()

        const response = await fetch(url, {
            credentials: 'include',
            method: 'POST',
            headers: {
                Cookie: authHeader,
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
