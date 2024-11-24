// 解析配置信息
import dotenv from "dotenv";

const result = dotenv.config({path: `.env.${process.env.NODE_ENV ?? 'development'}`})
if (result.error) {
    throw new Error(`解析配置出错: ${result.error}`)
}

interface IServerConfig {
    ENV: string,
    SELF_URL: string,
    INITIAL_DOMAINS: string,
    PORT: number,
    DATA_PATH: string,
}

function parseConfig(): IServerConfig {
    const config = {
        ENV: process.env.NODE_ENV || '',
        SELF_URL: process.env.SELF_URL || '',
        INITIAL_DOMAINS: process.env.INITIAL_DOMAINS || '',
        PORT: parseInt(process.env.PORT || '8202'),
        DATA_PATH: process.env.DATA_PATH || '.',
    }
    if (!config.ENV) {
        throw new Error('ENV is required')
    }
    if (!config.SELF_URL) {
        throw new Error('SELF_URL is required')
    }
    if (!config.INITIAL_DOMAINS) {
        throw new Error('INITIAL_DOMAINS is required')
    }
    if (!config.PORT) {
        throw new Error('PORT is required')
    }
    if (!config.DATA_PATH) {
        throw new Error('DATA_PATH is required')
    }

    return config
}

export const serverConfig = parseConfig()

export function isDev() {
    return serverConfig.ENV === 'development'
}

export function isProd() {
    return serverConfig.ENV === 'production'
}
