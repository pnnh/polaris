'use client'

import {decodeBase64String} from "atom";

export interface ClientConfig {
    ENV: string,
    AES_KEY: string,
    AES_IV: string,
    NEXT_PUBLIC_SELF_URL: string,
    CLIENT_ID: string,
    CLIENT_SECRET: string,
    INITIAL_DOMAINS: string,
    PORT: number,
    WORKER_PORT: number,
    DATA_PATH: string,
    DOMAINS: string,
    defaultDomain: {
        name: string,
        baseurl: string
    }
}

export function useClientConfig() {
    let serverData: string
    if (typeof window !== 'undefined') {
        serverData = document.getElementById('serverData')?.innerText || ''
        if (!serverData) {
            throw new Error('serverData is required')
        }
    } else {
        serverData = process.env.publicConfig || ''
    }
    const configText = decodeBase64String(serverData)
    return JSON.parse(configText) as ClientConfig;
}
