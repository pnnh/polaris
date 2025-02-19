import {encodeBase64String} from "@/atom/common/utils/basex";

export interface IServerConfig {
    NEXT_PUBLIC_SELF_URL: string
    PGDATABASE: string
}

export function useServerConfig(): IServerConfig {
    if (!process.env.NEXT_PUBLIC_SELF_URL) {
        throw new Error('NEXT_PUBLIC_SELF_URL is required')
    }
    if (!process.env.PGDATABASE) {
        throw new Error('PGDATABASE is required')
    }

    return {
        NEXT_PUBLIC_SELF_URL: process.env.NEXT_PUBLIC_SELF_URL || '',
        PGDATABASE: process.env.PGDATABASE || ''
    }
}

// 该方法仅能在server端调用
export function usePublicConfig() {
    const publicConfig = {
        ENV: process.env.NODE_ENV || '',
        NEXT_PUBLIC_SELF_URL: process.env.NEXT_PUBLIC_SELF_URL || '',
        PUBLIC_TURNSTILE: process.env.PUBLIC_TURNSTILE || '',
    }
    process.env.publicConfig = encodeBase64String(JSON.stringify(publicConfig))
    return publicConfig
}

export function isProd() {
    return process.env.NODE_ENV === 'production'
}
