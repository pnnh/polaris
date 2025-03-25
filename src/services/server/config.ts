import {encodeBase64String} from "@/atom/common/utils/basex";

export interface IServerConfig {
    NEXT_PUBLIC_SELF_URL: string
    PORTAL_URL: string
    NEXT_PUBLIC_PORTAL_URL: string
    PHOENIX_URL: string
    NEXT_PUBLIC_PHOENIX_URL: string
}

export function useServerConfig(): IServerConfig {
    if (!process.env.NEXT_PUBLIC_SELF_URL) {
        throw new Error('NEXT_PUBLIC_SELF_URL is required')
    }
    if (!process.env.PORTAL_URL) {
        throw new Error('PORTAL_URL is required')
    }
    if (!process.env.NEXT_PUBLIC_PORTAL_URL) {
        throw new Error('NEXT_PUBLIC_PORTAL_URL is required')
    }
    if (!process.env.PHOENIX_URL) {
        throw new Error('PHOENIX_URL is required')
    }
    if (!process.env.NEXT_PUBLIC_PHOENIX_URL) {
        throw new Error('NEXT_PUBLIC_PHOENIX_URL is required')
    }

    return {
        NEXT_PUBLIC_SELF_URL: process.env.NEXT_PUBLIC_SELF_URL || '',
        PORTAL_URL: process.env.PORTAL_URL || '',
        NEXT_PUBLIC_PORTAL_URL: process.env.NEXT_PUBLIC_PORTAL_URL || '',
        PHOENIX_URL: process.env.PHOENIX_URL || '',
        NEXT_PUBLIC_PHOENIX_URL: process.env.NEXT_PUBLIC_PHOENIX_URL || '',
    }
}

export function isProd() {
    return process.env.NODE_ENV === 'production'
}

// 获取Lightning资源URL
export function getLightningUrl(): string {
    if (isProd()) {
        return '/lightning/cloud.js'
    }
    return '/lightning/src/cloud.tsx'
}
