// 解析配置信息
import dotenv from "dotenv";
import {IAppConfig} from "../common/config";

const result = dotenv.config({path: `.env.${process.env.NODE_ENV ?? 'development'}`})
if (result.error) {
    throw new Error(`解析配置出错: ${result.error}`)
}

function parseConfig(): IAppConfig {
    const config = {
        ENV: process.env.NODE_ENV ?? 'development',
        WORKER_URL: process.env.WORKER_URL ?? ''
    }
    if (!config.ENV) {
        throw new Error('ENV is required')
    }
    if (!config.WORKER_URL) {
        throw new Error('WORKER_URL is required')
    }

    return config
}

export const serverConfig = parseConfig()


export async function serverGetAppConfig(): Promise<IAppConfig> {
    return serverConfig
}
