'use client'

export interface ClientConfig {
    ENV: string
    SELF_URL: string
    TURNSTILE_PUBLIC_KEY: string
    PORTAL_URL: string
}

let parsedClientConfig: ClientConfig | null = null

export function useClientConfig() {
    if (parsedClientConfig) {
        return parsedClientConfig
    }
    const clientConfig: ClientConfig = {
        ENV: process.env.NEXT_PUBLIC_NODE_ENV || '',
        SELF_URL: process.env.NEXT_PUBLIC_SELF_URL || '',
        TURNSTILE_PUBLIC_KEY: process.env.NEXT_PUBLIC_TURNSTILE_PUBLIC_KEY || '',
        PORTAL_URL: process.env.NEXT_PUBLIC_PORTAL_URL || '',
    }
    parsedClientConfig = clientConfig
    return clientConfig
}
