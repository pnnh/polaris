import {encodeBase64String} from "@/atom/common/utils/basex";

export interface IServerConfig {
    NEXT_PUBLIC_SELF_URL: string
    DirectoryList: string[],
    DATA_PATH: string,
    PGDATABASE: string
}

export function useServerConfig(): IServerConfig {
    if (!process.env.NEXT_PUBLIC_SELF_URL) {
        throw new Error('NEXT_PUBLIC_SELF_URL is required')
    }
    if (!process.env.DIRECTORIES) {
        throw new Error('DOMAINS is required')
    }
    if (!process.env.DATA_PATH) {
        throw new Error('DATA_PATH is required')
    }
    if (!process.env.PGDATABASE) {
        throw new Error('PGDATABASE is required')
    }
    const directories = process.env.DIRECTORIES.trim()
    const directoryList = JSON.parse(directories)

    return {
        NEXT_PUBLIC_SELF_URL: process.env.NEXT_PUBLIC_SELF_URL || '',
        DirectoryList: directoryList,
        DATA_PATH: process.env.DATA_PATH || '.',
        PGDATABASE: process.env.PGDATABASE || ''
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
    return process.env.NODE_ENV === 'production'
}

// todo: 临时辅助方法，后续需要优化掉换成别的实现方案
export function mustGetFirstDir() {
    const serverConfig = useServerConfig()
    const syncDir = serverConfig.DirectoryList.find(it=>true);    // 第一个
    if (!syncDir) {
        throw new Error("syncDir为空")
    }
    return syncDir
}
