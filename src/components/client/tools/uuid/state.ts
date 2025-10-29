
export enum OptionType {
    Random = 1,
    DNS = 2,
    URL = 3,
    OID = 4,
    X500 = 5,
    Custom = 6
}

export interface NormalUUIDItem {
    version: number,
    long: string,
    short: string,
    options?: {
        type: OptionType,
        namespace: string,
        name: string
    }
}

export const dnsNamespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
export const urlNamespace = '6ba7b811-9dad-11d1-80b4-00c04fd430c8'
export const oidNamespace = '6ba7b812-9dad-11d1-80b4-00c04fd430c8'
export const x500Namespace = '6ba7b814-9dad-11d1-80b4-00c04fd430c8'
