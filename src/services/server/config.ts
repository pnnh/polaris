export interface IServerConfig {
    NEXT_PUBLIC_SELF_URL: string
    NEXT_PUBLIC_PORTAL_URL: string
    NEXT_PUBLIC_PHOENIX_URL: string
}

export function useServerConfig(): IServerConfig {
    if (!process.env.NEXT_PUBLIC_SELF_URL) {
        throw new Error('NEXT_PUBLIC_SELF_URL is required')
    }
    if (!process.env.NEXT_PUBLIC_PORTAL_URL) {
        throw new Error('NEXT_PUBLIC_PORTAL_URL is required')
    }
    if (!process.env.NEXT_PUBLIC_PHOENIX_URL) {
        throw new Error('NEXT_PUBLIC_PHOENIX_URL is required')
    }

    return {
        NEXT_PUBLIC_SELF_URL: process.env.NEXT_PUBLIC_SELF_URL || '',
        NEXT_PUBLIC_PORTAL_URL: process.env.NEXT_PUBLIC_PORTAL_URL + '/portal',
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
