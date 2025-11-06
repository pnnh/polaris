import {IBrowserConfig} from "@/components/common/config";
import {ConfigOptions, initAppConfig} from "@/atom/server/config/config";

export interface IServerConfig {
    RUN_MODE: string
    PUBLIC_SELF_URL: string
    PUBLIC_PORTAL_URL: string
    CLOUDFLARE_PUBLIC_TURNSTILE: string
    PUBLIC_PANDORA_URL: string
    PUBLIC_LIGHTNING_URL: string
    DATABASE_URL: string
    PUBLIC_IMAGES_URL: string
}

let serverConfigInstance: IServerConfig | undefined;

export async function useServerConfig(): Promise<IServerConfig> {
    if (serverConfigInstance) {
        return serverConfigInstance
    }
    let configUrl = process.env.CONFIG;
    if (!configUrl) {
        throw new Error('CONFIG environment variable is required')
    }
    if (configUrl.startsWith("env://")) {
        const envName = configUrl.substring(6)
        configUrl = process.env[envName];
    }
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
    const appConfig = await initAppConfig(configUrl, configOptions)
    const selfUrl = await appConfig.GetString('app.PUBLIC_POLARIS_URL');
    const portalUrl = await appConfig.GetString('app.PUBLIC_PORTAL_URL');
    const turnstile = await appConfig.GetString('app.CLOUDFLARE_PUBLIC_TURNSTILE');
    const pandoraUrl = await appConfig.GetString('app.PUBLIC_PANDORA_URL');
    const lightningUrl = await appConfig.GetString('app.PUBLIC_LIGHTNING_URL');
    const databaseUrl = await appConfig.GetString('app.DATABASE_URL');
    const imagesUrl = await appConfig.GetString('app.PUBLIC_IMAGES_URL');

    if (!selfUrl) {
        throw new Error('PUBLIC_SELF_URL is required')
    }
    if (!portalUrl) {
        throw new Error('PUBLIC_PORTAL_URL is required')
    }
    if (!turnstile) {
        throw new Error('PUBLIC_TURNSTILE is required')
    }
    if (!pandoraUrl) {
        throw new Error('PUBLIC_PANDORA_URL is required')
    }
    if (!lightningUrl) {
        throw new Error('PUBLIC_LIGHTNING_URL is required')
    }
    if (!databaseUrl) {
        throw new Error('_URL is required')
    }
    if (!imagesUrl) {
        throw new Error('PUBLIC_IMAGES_URL is required')
    }
    serverConfigInstance = {
        RUN_MODE: runMode,
        PUBLIC_SELF_URL: selfUrl,
        PUBLIC_PORTAL_URL: portalUrl,
        CLOUDFLARE_PUBLIC_TURNSTILE: turnstile,
        PUBLIC_PANDORA_URL: pandoraUrl,
        PUBLIC_LIGHTNING_URL: lightningUrl,
        DATABASE_URL: databaseUrl,
        PUBLIC_IMAGES_URL: imagesUrl,
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
        PUBLIC_LIGHTNING_URL: serverConfig.PUBLIC_LIGHTNING_URL,
    }
}
