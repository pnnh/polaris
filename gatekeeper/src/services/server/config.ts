export interface IServerConfig {
    PUBLIC_SELF_URL: string
}

export function useServerConfig(): IServerConfig {
    return {
        PUBLIC_SELF_URL: process.env.PUBLIC_SELF_URL || 'http://localhost:7100'
    }
}
