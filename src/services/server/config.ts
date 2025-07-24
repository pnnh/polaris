import {IBrowserConfig} from "@/services/common/config";
import {ConfigOptions, initAppConfig} from "@/atom/server/config/config";

export interface IServerConfig {
    RUN_MODE: string
    PUBLIC_SELF_URL: string
    PUBLIC_PORTAL_URL: string
    CLOUDFLARE_PUBLIC_TURNSTILE: string
}

let serverConfigInstance: IServerConfig | undefined;

export async function useServerConfig(): Promise<IServerConfig> {
    if (serverConfigInstance) {
        return serverConfigInstance
    }
    const configUrl = process.env.CONFIG;
    if (!configUrl) {
        throw new Error('CONFIG environment variable is required')
    }
    const runMode = getRunMode();
    const configOptions: ConfigOptions = {
        project: "huable",
        app: "polaris",
        env: runMode,
        svc: "polaris"
    }
    const appConfig = initAppConfig(configUrl, configOptions)
    const selfUrl = await appConfig.GetString('app.PUBLIC_POLARIS_URL');
    const portalUrl = await appConfig.GetString('app.PUBLIC_PORTAL_URL');
    const turnstile = await appConfig.GetString('app.CLOUDFLARE_PUBLIC_TURNSTILE');

    if (!selfUrl) {
        throw new Error('PUBLIC_SELF_URL is required')
    }
    if (!portalUrl) {
        throw new Error('PUBLIC_PORTAL_URL is required')
    }
    if (!turnstile) {
        throw new Error('PUBLIC_TURNSTILE is required')
    }
    serverConfigInstance = {
        RUN_MODE: runMode,
        PUBLIC_SELF_URL: selfUrl,
        PUBLIC_PORTAL_URL: portalUrl,
        CLOUDFLARE_PUBLIC_TURNSTILE: turnstile,
    };

    return serverConfigInstance;
}

export function getRunMode() {
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

export function usePublicConfig(serverConfig: IServerConfig): IBrowserConfig {
    return {
        PUBLIC_MODE: serverConfig.RUN_MODE,
        PUBLIC_SELF_URL: serverConfig.PUBLIC_SELF_URL,
        PUBLIC_TURNSTILE: serverConfig.CLOUDFLARE_PUBLIC_TURNSTILE,
        PUBLIC_PORTAL_URL: serverConfig.PUBLIC_PORTAL_URL,
    }
}
