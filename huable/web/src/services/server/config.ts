import 'server-only'

import * as fs from "node:fs";
import {encodeBase64String} from "atom";

export function useServerConfig() {
    const config = {
        ENV: process.env.NODE_ENV || '',
        AES_KEY: process.env.AES_KEY || '',
        AES_IV: process.env.AES_IV || '',
        NEXT_PUBLIC_SELF_URL: process.env.NEXT_PUBLIC_SELF_URL || '',
        CLIENT_ID: process.env.CLIENT_ID || '',
        CLIENT_SECRET: process.env.CLIENT_SECRET || '',
        INITIAL_DOMAINS: process.env.INITIAL_DOMAINS || '',
        DOMAINS: process.env.DOMAINS || '',
        PORT: parseInt(process.env.PORT || '8100'),
        WORKER_PORT: parseInt(process.env.WORKER_PORT || '8101'),
        DATA_PATH: process.env.DATA_PATH || '.',
        defaultDomain: {
            name: '',
            baseurl: ''
        }
    }
    if (!config.ENV) {
        throw new Error('ENV is required')
    }
    if (!config.AES_KEY) {
        throw new Error('AES_KEY is required')
    }
    if (!config.AES_IV) {
        throw new Error('AES_IV is required')
    }
    if (!config.NEXT_PUBLIC_SELF_URL) {
        throw new Error('NEXT_PUBLIC_SELF_URL is required')
    }
    if (!config.CLIENT_ID) {
        throw new Error('CLIENT_ID is required')
    }
    if (!config.CLIENT_SECRET) {
        throw new Error('CLIENT_SECRET is required')
    }
    if (!config.INITIAL_DOMAINS) {
        throw new Error('INITIAL_DOMAINS is required')
    }
    if (!config.PORT) {
        throw new Error('PORT is required')
    }
    if (!config.WORKER_PORT) {
        throw new Error('WORKER_PORT is required')
    }
    if (!config.DATA_PATH) {
        throw new Error('DATA_PATH is required')
    }
    if (!config.DOMAINS) {
        throw new Error('DOMAINS is required')
    }
    const fileFileName = config.DOMAINS.replace(/\w+:\/\//g, '')
    const configText = fs.readFileSync(fileFileName, 'utf-8')
    const domainsConfig = JSON.parse(configText)
    for (const key in domainsConfig) {
        const domain = domainsConfig[key]
        if (!domain.name) {
            throw new Error('DOMAINS.name is required')
        }
        if (!domain.baseurl) {
            throw new Error('DOMAINS.baseurl is required')
        }
        if (!domain.default) {
            throw new Error('DOMAINS.default is required')
        }
        const isDefault = domain.default
        if (isDefault) {
            config.defaultDomain = domain
        }
    }

    return config
}

// 该方法仅能在server端调用
export function usePublicConfig() {
    const serverConfig = useServerConfig()
    const publicConfig = {
        ENV: process.env.NODE_ENV || '',
        NEXT_PUBLIC_SELF_URL: process.env.NEXT_PUBLIC_SELF_URL || '',
        defaultDomain: serverConfig.defaultDomain
    }
    process.env.publicConfig = encodeBase64String(JSON.stringify(publicConfig))
    return publicConfig
}

export function isProd() {
    const serverConfig = useServerConfig()
    return serverConfig.ENV === 'production'
}
