export interface IServerConfig {
    PUBLIC_SELF_URL: string
    PUBLIC_PORTAL_URL: string
    PUBLIC_PHOENIX_URL: string
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

    return {
        PUBLIC_SELF_URL: process.env.PUBLIC_SELF_URL || '',
        PUBLIC_PORTAL_URL: process.env.PUBLIC_PORTAL_URL + '/portal',
        PUBLIC_PHOENIX_URL: process.env.PUBLIC_PHOENIX_URL || '',
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
