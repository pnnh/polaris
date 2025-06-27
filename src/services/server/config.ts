import dotenv from "dotenv";

import {IBrowserConfig} from "@/services/common/config";

console.log('process.env.RUN_MODE', process.env.RUN_MODE)

let isConfigLoaded = false

function loadConfig() {
    if (isConfigLoaded) {
        return
    }
    // 根据环境从不同的文件加载配置
    const envPath = `.env.${runMode()}`
    console.log('当前配置环境', envPath)
    const result = dotenv.config({path: envPath})
    if (result.error) {
        throw new Error(`解析配置出错: ${result.error}`)
    }
    isConfigLoaded = true
}

export interface IServerConfig {
    PUBLIC_SELF_URL: string
    PUBLIC_PORTAL_URL: string
    PUBLIC_LIGHTNING_URL: string
    PUBLIC_TURNSTILE: string
}

export function useServerConfig(): IServerConfig {
    loadConfig()
    if (!process.env.PUBLIC_SELF_URL) {
        throw new Error('PUBLIC_SELF_URL is required')
    }
    if (!process.env.PUBLIC_PORTAL_URL) {
        throw new Error('PUBLIC_PORTAL_URL is required')
    }
    if (!process.env.PUBLIC_LIGHTNING_URL) {
        throw new Error('PUBLIC_LIGHTNING_URL is required')
    }
    if (!process.env.PUBLIC_TURNSTILE) {
        throw new Error('PUBLIC_TURNSTILE is required')
    }

    return {
        PUBLIC_SELF_URL: process.env.PUBLIC_SELF_URL || '',
        PUBLIC_PORTAL_URL: process.env.PUBLIC_PORTAL_URL,
        PUBLIC_TURNSTILE: process.env.PUBLIC_TURNSTILE || '',
        PUBLIC_LIGHTNING_URL: process.env.PUBLIC_LIGHTNING_URL || '',
    }
}

export function runMode() {
    return process.env.RUN_MODE || 'development'
}

export function isDev() {
    return process.env.RUN_MODE === 'development'
}

export function isTest() {
    return process.env.RUN_MODE === 'test'
}

export function isProd() {
    return process.env.RUN_MODE === 'production'
}

export function usePublicConfig(serverConfig?: IServerConfig): IBrowserConfig {
    if (!serverConfig) {
        serverConfig = useServerConfig()
    }
    return {
        PUBLIC_SELF_URL: serverConfig.PUBLIC_SELF_URL,
        PUBLIC_MODE: runMode(),
        PUBLIC_TURNSTILE: serverConfig.PUBLIC_TURNSTILE,
        PUBLIC_PORTAL_URL: serverConfig.PUBLIC_PORTAL_URL,
    }
}

// 获取Lightning资源URL
export function getLightningUrl(): string {
    const serverConfig = useServerConfig()
    if (isDev()) {
        return `${serverConfig.PUBLIC_LIGHTNING_URL}/src/client/cloud.tsx`
    }
    return `${serverConfig.PUBLIC_LIGHTNING_URL}/assets/cloud.mjs`
}
