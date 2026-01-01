import {IBrowserConfig} from "@/components/common/config";
import {serverGetGlobalVariable, serverSetGlobalVariable} from "@pnnh/atom/nodejs";
import {ConfigOptions, initAppConfig} from "@/components/server/config/config";

export interface IServerConfig {
    RUN_MODE: string
    PUBLIC_SELF_URL: string
    PUBLIC_PORTAL_URL: string
    INTERNAL_PORTAL_URL: string
    CLOUDFLARE_PUBLIC_TURNSTILE: string
    DATABASE_URL: string
}

const serverConfigKey = 'SERVER_CONFIG';

export async function useServerConfig(): Promise<IServerConfig> {
    let serverConfigInstance = serverGetGlobalVariable(serverConfigKey) as IServerConfig | undefined;
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
    const selfUrl = await appConfig.GetString('PUBLIC_POLARIS_URL');
    const portalUrl = await appConfig.GetString('PUBLIC_PORTAL_URL');
    const internalPortalUrl = await appConfig.GetString('INTERNAL_PORTAL_URL');
    const turnstile = await appConfig.GetString('CLOUDFLARE_PUBLIC_TURNSTILE');
    const databaseUrl = await appConfig.GetString('DATABASE_URL');

    if (!selfUrl) {
        throw new Error('PUBLIC_SELF_URL is required')
    }
    if (!portalUrl) {
        throw new Error('PUBLIC_PORTAL_URL is required')
    }
    if (!internalPortalUrl) {
        throw new Error('internalPortalUrl is required')
    }
    if (!turnstile) {
        throw new Error('PUBLIC_TURNSTILE is required')
    }
    if (!databaseUrl) {
        throw new Error('_URL is required')
    }
    serverConfigInstance = {
        RUN_MODE: runMode,
        PUBLIC_SELF_URL: selfUrl,
        PUBLIC_PORTAL_URL: portalUrl,
        CLOUDFLARE_PUBLIC_TURNSTILE: turnstile,
        DATABASE_URL: databaseUrl,
        INTERNAL_PORTAL_URL: internalPortalUrl,
    };
    serverSetGlobalVariable(serverConfigKey, serverConfigInstance);

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
