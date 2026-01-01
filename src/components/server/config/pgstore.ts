import {IServerConfigStore} from "./store";
import {ConfigOptions} from "./config";
import {isValidName} from "@pnnh/atom";
import NodeCache from "node-cache";
import {serverGetGlobalVariable, serverSetGlobalVariable} from "@pnnh/atom/nodejs";
import {initPgdbFor, pgQueryOneFor} from "@/components/server/pgsql/pgsql";

const configCacheKey = 'configCache';
const PgConfigDbname = 'configdb';
serverSetGlobalVariable(configCacheKey, new NodeCache({stdTTL: 30, checkperiod: 10}));

export class PgConfigStore implements IServerConfigStore {
    private configUrl: string;
    private configOptions: ConfigOptions;

    constructor(configUrl: string, options: ConfigOptions) {
        this.configUrl = configUrl;
        this.configOptions = options;
    }

    static async NewPgConfigStore(configUrl: string, options: ConfigOptions) {
        await initPgdbFor(PgConfigDbname, configUrl);
        return new PgConfigStore(configUrl, options)
    }

    async GetValue(key: string): Promise<any | undefined> {
        key = key.trim();
        if (!key) {
            throw new Error('Key cannot be empty');
        }
        const nameList = key.split('.');
        let scope: string, name: string
        if (nameList.length === 1) {
            scope = 'svc'
            name = key
        } else if (nameList.length === 2) {
            scope = nameList[0].trim();
            name = nameList[1].trim();
        } else {
            throw new Error('Invalid key format, expected "scope.name" or "name"');
        }
        if (!isValidName(scope) || !isValidName(name)) {
            throw new Error(`Invalid scope or name: ${scope}, ${name}`);
        }
        const cacheKey = `${this.configOptions.project}.${this.configOptions.app}.${this.configOptions.env}.${this.configOptions.svc}.${scope}.${name}`;
        const configCache: NodeCache = serverGetGlobalVariable(configCacheKey);
        const cacheValue = configCache.get(cacheKey);
        if (cacheValue) {
            console.debug(`cacheValue`);
            return cacheValue;
        }
        console.debug(`cacheValue2`);
        let baseSqlText = ` select c.content 
from galaxy.configuration c `

        let whereText = ` where c.name = $/name/ `;

        const sqlParams: any = {
            environment: this.configOptions.env,
            name,
        };

        const fullSqlText = ` ${baseSqlText} ${whereText} limit 1;`;

        const sqlResult = await pgQueryOneFor(PgConfigDbname, fullSqlText, sqlParams);
        if (!sqlResult || !sqlResult.content) {
            throw new Error(`Config value not found for ${key}`);
        }
        const configValue = sqlResult.content as string

        configCache.set(cacheKey, configValue);
        return configValue;
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
