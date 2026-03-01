import dotenv from "dotenv";

import {IServerConfigStore} from "./store";
import {GalaxyConfigStore} from "./galaxy";
import {PgConfigStore} from "./pgstore";
import {getEnvName, getRunMode, IServerConfigProvider} from "../config";
import {psResolvePath} from "@/components/server/filesystem/path";

export class FileConfigProvider implements IServerConfigProvider {
    private configStore: IServerConfigStore;
    private selfUrl: string = '';
    private portalUrl: string = '';
    private internalPortalUrl: string = '';
    private stargateUrl: string = '';
    private internalStargateUrl: string = '';
    private turnstile: string | undefined = undefined;
    private databaseUrl: string | undefined = undefined;
    private storageUrl: string = '';
    private runMode: string = getRunMode();
    private envName: string = getEnvName()
    private serveMode: string = ''

    constructor(configStore: IServerConfigStore) {
        this.configStore = configStore;
    }

    // 加载配置项，验证必填项。在获取配置之前必须先调用此方法。
    async LoadConfig() {

        const selfUrl = await this.configStore.GetString('PUBLIC_POLARIS_URL');
        const portalUrl = await this.configStore.GetString('PUBLIC_PORTAL_URL');
        const internalPortalUrl = await this.configStore.GetString('INTERNAL_PORTAL_URL');
        const serveMode = await this.configStore.GetString('SERVE_MODE');
        if (serveMode !== 'SELFHOST' && serveMode !== 'CLOUDNET' && serveMode !== 'LOCALNET') {
            throw new Error('Invalid SERVE_MODE, expected "SELFHOST", "CLOUDNET" or "LOCALNET"')
        }
        this.serveMode = serveMode

        if (!selfUrl) {
            throw new Error('PUBLIC_SELF_URL is required')
        }
        if (!portalUrl) {
            throw new Error('PUBLIC_PORTAL_URL is required')
        }
        if (!internalPortalUrl) {
            throw new Error('internalPortalUrl is required')
        }
        if (serveMode === 'CLOUDNET') {
            const turnstile = await this.configStore.GetString('CLOUDFLARE_PUBLIC_TURNSTILE');
            if (!turnstile) {
                throw new Error('PUBLIC_TURNSTILE is required')
            }
            this.turnstile = turnstile;
        }
        const databaseUrl = await this.configStore.GetString('DATABASE_URL');
        if (!databaseUrl) {
            throw new Error('_URL is required')
        }
        this.selfUrl = selfUrl;
        this.portalUrl = portalUrl;
        this.internalPortalUrl = internalPortalUrl;
        this.databaseUrl = databaseUrl;
        const storageUrl = await this.configStore.GetString('STORAGE_URL');
        if (!storageUrl) {
            throw new Error('STORAGE_URL is required')
        }
        this.storageUrl = storageUrl;
    }

    get CLOUDFLARE_PUBLIC_TURNSTILE(): string | undefined {
        return this.turnstile;
    }

    // todo: 该变量在运行时不再需要，后续可以删除
    get CONFIG(): string {
        return ""
    }

    get DATABASE_URL(): string | undefined {
        return this.databaseUrl;
    }

    get ENV_NAME(): string {
        return this.envName
    }

    get PUBLIC_PORTAL_URL(): string {
        return this.portalUrl;
    }

    get INTERNAL_PORTAL_URL(): string {
        return this.internalPortalUrl;
    }

    get PUBLIC_STARGATE_URL(): string {
        return this.stargateUrl;
    }

    get INTERNAL_STARGATE_URL(): string {
        return this.internalStargateUrl;
    }

    get PUBLIC_SELF_URL(): string {
        return this.selfUrl;
    }

    get RUN_MODE(): string {
        return this.runMode;
    }

    get SERVE_MODE(): string {
        return this.serveMode;
    }

    get STORAGE_URL(): string {
        return this.storageUrl;
    }
}

export class FileConfigStore implements IServerConfigStore {
    private configRecord: Record<string, any> = {};

    constructor(envPath: string) {
        const fullPath = psResolvePath(envPath)
        const result = dotenv.config({path: fullPath, processEnv: this.configRecord})
        if (result.error) {
            throw new Error(`load config error: ${result.error}`)
        }
    }

    async GetProvider(): Promise<IServerConfigProvider> {
        const fileProvider = new FileConfigProvider(this);
        await fileProvider.LoadConfig();
        return fileProvider
    }

    async GetValue(key: string): Promise<any | undefined> {
        key = key.trim();
        if (!key) {
            throw new Error('Key cannot be empty');
        }
        const envValue = process.env[key];
        if (envValue !== undefined) {
            return envValue;
        }
        // 以下为旧逻辑
        // const nameList = key.split('.');
        // let name: string
        // if (nameList.length === 1) {
        //     name = key;
        // } else if (nameList.length === 2) {
        //     name = nameList[1].trim();
        // } else {
        //     throw new Error('Invalid key format, expected "scope.name" or "name"');
        // }
        return this.configRecord[key];
    }

    async GetString(key: string): Promise<string | undefined> {
        const value = await this.GetValue(key);
        const strValue = typeof value === 'string' ? value : undefined;
        return strValue ? strValue.trim() : undefined;
    }

    async GetNumber(key: string): Promise<number | undefined> {
        const value = await this.GetValue(key);
        const numValue = Number(value);
        return !isNaN(numValue) ? numValue : undefined;
    }

    async GetBoolean(key: string): Promise<boolean | undefined> {
        const value = await this.GetValue(key);
        const strValue = String(value).toLowerCase();
        if (strValue === 'true' || strValue === '1') {
            return true;
        } else if (strValue === 'false' || strValue === '0') {
            return false;
        } else {
            return undefined;
        }
    }
}

export interface ConfigOptions {
    project: string
    app: string
    env: string
    svc: string
}

export async function initAppConfig(configUrl: string, options: ConfigOptions): Promise<IServerConfigStore> {
    if (!configUrl) {
        throw new Error('configUrl is required')
    }
    if (!options.project) {
        throw new Error('project is required')
    }
    if (!options.app) {
        throw new Error('app is required')
    }
    if (!options.env) {
        throw new Error('env is required')
    }
    if (!options.svc) {
        throw new Error('svc is required')
    }

    if (configUrl.startsWith("galaxy://")) {
        const galaxyUrl = configUrl.replace("galaxy://", "http://");
        return new GalaxyConfigStore(galaxyUrl, options);
    } else if (configUrl.startsWith("postgres://")) {
        return await PgConfigStore.NewPgConfigStore(configUrl, options)
    }
    return new FileConfigStore(configUrl);
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
