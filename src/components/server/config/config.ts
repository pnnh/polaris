import dotenv from "dotenv";

import {IServerConfigStore} from "./store";
import {GalaxyConfigStore} from "./galaxy";
import {PgConfigStore} from "./pgstore";
import {IServerConfigProvider} from "../config";
import {resolvePath} from "@pnnh/atom/nodejs";
import {psResolvePath} from "@/components/server/filesystem/path";

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
        const selfUrl = await this.GetString('PUBLIC_POLARIS_URL');
        const portalUrl = await this.GetString('PUBLIC_PORTAL_URL');
        const internalPortalUrl = await this.GetString('INTERNAL_PORTAL_URL');
        const turnstile = await this.GetString('CLOUDFLARE_PUBLIC_TURNSTILE');
        const databaseUrl = await this.GetString('DATABASE_URL');

        if (!selfUrl) {
            throw new Error('PUBLIC_SELF_URL is required')
        }
        if (!portalUrl) {
            throw new Error('PUBLIC_PORTAL_URL is required')
        }
        if (!internalPortalUrl) {
            throw new Error('internalPortalUrl is required')
        }
        // if (!turnstile) {
        //     throw new Error('PUBLIC_TURNSTILE is required')
        // }
        // if (!databaseUrl) {
        //     throw new Error('_URL is required')
        // }

        return {
            PUBLIC_SELF_URL: selfUrl,
            PUBLIC_PORTAL_URL: portalUrl,
            // CLOUDFLARE_PUBLIC_TURNSTILE: turnstile,
            // DATABASE_URL: databaseUrl,
            INTERNAL_PORTAL_URL: internalPortalUrl,
        } as IServerConfigProvider;
    }

    async GetValue(key: string): Promise<any | undefined> {
        key = key.trim();
        if (!key) {
            throw new Error('Key cannot be empty');
        }
        const nameList = key.split('.');
        let name: string
        if (nameList.length === 1) {
            name = key;
        } else if (nameList.length === 2) {
            name = nameList[1].trim();
        } else {
            throw new Error('Invalid key format, expected "scope.name" or "name"');
        }
        return this.configRecord[name];
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
