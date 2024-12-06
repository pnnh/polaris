import 'server-only'

import {encodeBase64String} from "@/utils/basex";

export interface IServerConfig {
    NEXT_PUBLIC_SELF_URL: string
    DirectoryList: string[]
}

export function useServerConfig(): IServerConfig {
    if (!process.env.NEXT_PUBLIC_SELF_URL) {
        throw new Error('NEXT_PUBLIC_SELF_URL is required')
    }
    if (!process.env.DIRECTORIES) {
        throw new Error('DOMAINS is required')
    }
    const directories = process.env.DIRECTORIES.trim()
    const directoryList = JSON.parse(directories)

    return {
        NEXT_PUBLIC_SELF_URL: process.env.NEXT_PUBLIC_SELF_URL || '',
        DirectoryList: directoryList
    }
}

// 该方法仅能在server端调用
export function usePublicConfig() {
    const publicConfig = {
        ENV: process.env.NODE_ENV || '',
        NEXT_PUBLIC_SELF_URL: process.env.NEXT_PUBLIC_SELF_URL || ''
    }
    process.env.publicConfig = encodeBase64String(JSON.stringify(publicConfig))
    return publicConfig
}

export function isProd() {
    const serverConfig = useServerConfig()
    return process.env.NODE_ENV === 'production'
}
