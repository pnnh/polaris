interface IServerConfig {
    INITIAL_DOMAINS: string,
    NEXT_PUBLIC_SELF_URL: string,
}

export const serverConfig = {
    INITIAL_DOMAINS: process.env.INITIAL_DOMAINS,
    NEXT_PUBLIC_SELF_URL: process.env.NEXT_PUBLIC_SELF_URL,
} as IServerConfig
