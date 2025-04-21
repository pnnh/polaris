import {IBrowserConfig} from "@/services/common/config";

export interface IServerConfig {
    PUBLIC_SELF_URL: string
    PUBLIC_PORTAL_URL: string
    PUBLIC_PHOENIX_URL: string
    PUBLIC_TURNSTILE: string
}

export function useServerConfig(): IServerConfig {
    if (!process.env.PUBLIC_SELF_URL) {
        throw new Error('PUBLIC_SELF_URL is required')
    }
    if (!process.env.PUBLIC_PORTAL_URL) {
        throw new Error('PUBLIC_PORTAL_URL is required')
    }
    if (!process.env.PUBLIC_PHOENIX_URL) {
        throw new Error('PUBLIC_PHOENIX_URL is required')
    }
    if (!process.env.PUBLIC_TURNSTILE) {
        throw new Error('PUBLIC_TURNSTILE is required')
    }

    return {
        PUBLIC_SELF_URL: process.env.PUBLIC_SELF_URL || '',
        PUBLIC_PORTAL_URL: process.env.PUBLIC_PORTAL_URL,
        PUBLIC_PHOENIX_URL: process.env.PUBLIC_PHOENIX_URL || '',
        PUBLIC_TURNSTILE: process.env.PUBLIC_TURNSTILE || '',
    }
}

export function isProd() {
    return process.env.NODE_ENV === 'production'
}

export function usePublicConfig(): IBrowserConfig {
    const serverConfig = useServerConfig()
    return {
        PUBLIC_SELF_URL: serverConfig.PUBLIC_SELF_URL,
        PUBLIC_MODE: isProd() ? 'production' : 'development',
        PUBLIC_TURNSTILE: serverConfig.PUBLIC_TURNSTILE,
        PUBLIC_PORTAL_URL: serverConfig.PUBLIC_PORTAL_URL,
    }
}

// 获取Lightning资源URL
export function getLightningUrl(): string {
    const serverConfig = useServerConfig()
    if (isProd()) {
        return `${serverConfig.PUBLIC_PHOENIX_URL}/lightning/assets/cloud.mjs`
    }
    return '/lightning/src/client/cloud.tsx'
}
