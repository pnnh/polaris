'use client'

import {decodeBase58String} from "@pnnh/atom";
import {clientGetWindowVariable, clientSetWindowVariable} from "@pnnh/atom/browser";

const CLIENT_CONFIG_KEY = 'ClientConfig'

export function useClientConfig(encodedBrowserConfig?: string): any {
    let configValue = clientGetWindowVariable(CLIENT_CONFIG_KEY)
    if (configValue) {
        return configValue
    }
    if (encodedBrowserConfig) {
        const configText = decodeBase58String(encodedBrowserConfig)
        configValue = JSON.parse(configText)
        clientSetWindowVariable(CLIENT_CONFIG_KEY, configValue)
        return configValue
    }
    const lgEnv = document.getElementById('LGEnv') as HTMLInputElement
    if (!lgEnv) {
        throw Error('没有找到 LGEnv 元素，无法获取配置')
    }
    if (!lgEnv.value) {
        throw Error('LGEnv 元素没有内容，无法获取配置')
    }
    const configText = decodeBase58String(lgEnv.value)
    configValue = JSON.parse(configText)
    clientSetWindowVariable(CLIENT_CONFIG_KEY, configValue)
    return configValue
}
