import {IServerConfigProvider} from "@/components/server/config";

export interface IServerConfigStore {
    GetValue(key: string): Promise<any | undefined>;

    GetString(key: string): Promise<string | undefined>;

    GetNumber(key: string): Promise<number | undefined>;

    GetBoolean(key: string): Promise<boolean | undefined>;

    GetProvider(): Promise<IServerConfigProvider>
}
