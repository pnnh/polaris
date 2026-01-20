import {IBrowserConfig} from "@/components/common/config";
import {serverGetGlobalVariable, serverSetGlobalVariable} from "@pnnh/atom/nodejs";
import {ConfigOptions, initAppConfig} from "@/components/server/config/config";

export interface IServerConfigProvider {
    get RUN_MODE(): string

    get PUBLIC_SELF_URL(): string

    get PUBLIC_PORTAL_URL(): string

    get INTERNAL_PORTAL_URL(): string

    get CLOUDFLARE_PUBLIC_TURNSTILE(): string

    get DATABASE_URL(): string

    get STORAGE_URL(): string
}

const serverConfigKey = 'SERVER_CONFIG';

export async function useServerConfig(): Promise<IServerConfigProvider> {
    let serverConfigInstance = serverGetGlobalVariable(serverConfigKey) as IServerConfigProvider | undefined;
    if (serverConfigInstance) {
        return serverConfigInstance
    }
    let configUrl = process.env.CONFIG;

    if (!configUrl) {
        configUrl = "file://work/config/host.env"
    } else if (configUrl.startsWith("env://")) {
        const envName = configUrl.substring(6)
        configUrl = process.env[envName];
        if (!configUrl) {
            throw new Error(`Config URL not found in environment variable: ${envName}`);
        }
    }
    const runMode = getRunMode();
    const configOptions: ConfigOptions = {
        project: "huable",
        app: "polaris",
        env: runMode,
        svc: "polaris"
    }
    const configStore = await initAppConfig(configUrl, configOptions)
    serverConfigInstance = await configStore.GetProvider();
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

export function usePublicConfig(serverConfig: IServerConfigProvider): IBrowserConfig {
    return {
        PUBLIC_MODE: serverConfig.RUN_MODE,
        PUBLIC_SELF_URL: serverConfig.PUBLIC_SELF_URL,
        PUBLIC_TURNSTILE: serverConfig.CLOUDFLARE_PUBLIC_TURNSTILE,
        PUBLIC_PORTAL_URL: serverConfig.PUBLIC_PORTAL_URL,
    }
}
