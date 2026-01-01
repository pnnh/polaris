import {IServerConfigStore} from "./store";
import {ConfigOptions} from "./config";
import {isValidName, CodeOk, CommonResult} from "@pnnh/atom";
import NodeCache from "node-cache";

const configCache = new NodeCache({stdTTL: 30, checkperiod: 10});

interface GalaxyConfigData {
    project: string;
    app: string;
    env: string;
    svc: string;
    scope: string;
    name: string;
    value: string;
}

export class GalaxyConfigStore implements IServerConfigStore {
    private configUrl: string;
    private configOptions: ConfigOptions;

    constructor(configUrl: string, options: ConfigOptions) {
        this.configUrl = configUrl;
        this.configOptions = options;
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
        const getUrl = `${this.configUrl}/config?project=${this.configOptions.project}&app=${this.configOptions.app}&env=${this.configOptions.env}&svc=${this.configOptions.svc}&scope=${scope}&name=${name}`;

        const cacheValue = configCache.get(getUrl);
        if (cacheValue) {
            return cacheValue;
        }
        const getResponse = await fetch(getUrl, {method: 'GET'})
        const getResult = await getResponse.json() as CommonResult<GalaxyConfigData>;
        if (!getResult || getResult.code !== CodeOk || !getResult.data) {
            throw new Error(`Failed to get config value for ${key}: ${getResult.message}`);
        }
        configCache.set(getUrl, getResult.data.value);
        return getResult.data.value;
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
