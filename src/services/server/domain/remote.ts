import {cookies} from "next/headers";
import {IDomain} from "@/services/common/domain";
import axios from "axios";

export class RemoteDomain implements IDomain {
    baseUrl: string

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    async makeGet<T>(urlString: string) {
        urlString = this.baseUrl + urlString

        const cookieStore = await cookies()
        const authHeader = cookieStore.toString()

        // const response = await fetch(urlString, {
        //     credentials: 'include',
        //     method: 'GET',
        //     cache: 'force-cache',
        //     next: {
        //         revalidate: 30, // Revalidate every xx seconds
        //     },
        //     headers: {
        //         Cookie: authHeader,
        //         Accept: 'application/json',
        //     },
        // })
        // return response.json()

        const response = await axios<T>({
            url: urlString,
            method: 'GET',
            headers: {
                Cookie: authHeader,
                Accept: 'application/json',
            },
            withCredentials: true,
        })
        return response.data
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
