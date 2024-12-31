'use client'

import {decodeBase64String} from "@/atom/common/utils/basex";

export interface ClientConfig {
    NEXT_PUBLIC_SELF_URL: string
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
