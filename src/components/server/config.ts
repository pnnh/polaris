import {IBrowserConfig} from "@/components/common/config";
import {serverGetGlobalVariable, serverSetGlobalVariable} from "@pnnh/atom/nodejs";
import {ConfigOptions, initAppConfig} from "@/components/server/config/config";

// 服务器配置提供者接口，定义了服务器配置的结构和访问方式
// 通过环境变量读取到的配置可以覆盖配置文件或者配置中心的同名配置，优先级更高，适用于一些敏感信息或者需要动态调整的配置项。
export interface IServerConfigProvider {
    // 运行模式，DEBUG、RELEASE等，控制程序运行时的一些行为
    // 该值无法通过环境变量或者配置文件指定，取决于程序如何编译构建的
    get RUN_MODE(): string

    // 服务模式，不同服务模式会具有不同的认证和权限逻辑
    // SELFHOST - 本地主机服务
    // LOCALNET - 本地局域网服务
    // CLOUDNET - 云上广域网服务
    get SERVE_MODE(): string

    // 环境名称，代表一组默认配置，可以影响业务上的一些行为
    // 包含development、production、test等，具有预设的默认值
    // 该值仅可以通过环境变量指定，无法通过配置文件指定，因为该变量决定了要如何加载配置文件，从本地文件或远程配置中心
    // 也可以自定义并提供配置文件地址或者其它获取配置的方式
    // 和RUN_MODE有些不同，前者影响程序运行时的行为，后者更多是影响业务逻辑上的一些行为
    get ENV_NAME(): string

    // 配置文件的URL地址，可以是一个本地文件路径，也可以是一个远程配置中心的URL地址，或者是一个本地目录地址
    // 将结合该值和ENV_NAME来决定最终如何加载配置，从本地文件系统或者从哪个配置中心获取配置内容
    get CONFIG(): string

    // 当前服务的对外URL地址
    get PUBLIC_SELF_URL(): string

    // 可公开匿名访问的一些功能的后端接口，包括登录注册相关
    get PUBLIC_PORTAL_URL(): string

    get INTERNAL_PORTAL_URL(): string

    // 控制台相关接口，包括常规用户和管理员用户控制台
    get PUBLIC_STARGATE_URL(): string

    get INTERNAL_STARGATE_URL(): string

    // 当以CLOUDNET模式运行时，提供给前端的Cloudflare Turnstile的site key，用于前端验证码功能
    get CLOUDFLARE_PUBLIC_TURNSTILE(): string | undefined

    // 有时后当前项目需要绕过后端接口直接访问数据库查询内容
    get DATABASE_URL(): string | undefined

    // 文件存储服务的URL地址，可能是一个对象存储服务或者专门的文件服务器，前端可以直接上传下载文件到这个地址
    get STORAGE_URL(): string

}

const serverConfigKey = 'SERVER_CONFIG';

export async function useServerConfig(): Promise<IServerConfigProvider> {
    let serverConfigInstance = serverGetGlobalVariable(serverConfigKey) as IServerConfigProvider | undefined;
    if (serverConfigInstance) {
        return serverConfigInstance
    }
    let envName = getEnvName()
    let configUrl = process.env.CONFIG;

    if (!configUrl) {
        if (envName === "development") {
            configUrl = "file://work/config/host.env"
        } else if (envName === "test" || envName === "production") {
            // todo: 生产环境和测试环境的默认配置地址可以不同，或者都指向同一个地址，具体取决于部署方式和配置中心的设计
            configUrl = "file://work/config/host.env"
        } else {
            // todo: 当前程序运行在特殊的环境下，具体如何获取配置取决于ENV_NAME的具体，暂时抛出异常
            throw new Error(`Config URL is not specified and cannot determine default config URL for env: ${envName}`);
        }
    } else if (configUrl.startsWith("env://")) {
        const envName = configUrl.substring(6)
        configUrl = process.env[envName];
        if (!configUrl) {
            throw new Error(`Config URL not found in environment variable: ${envName}`);
        }
    }
    const configOptions: ConfigOptions = {
        project: "huable",
        app: "polaris",
        env: envName,
        svc: "polaris"
    }
    const configStore = await initAppConfig(configUrl, configOptions)
    serverConfigInstance = await configStore.GetProvider();
    serverSetGlobalVariable(serverConfigKey, serverConfigInstance);

    return serverConfigInstance;
}

// 获取当前程序的运行模式。因为Nodejs无需编译，所以无法通过编译时的宏定义来区分DEBUG和RELEASE模式，因此只能通过环境变量来判断。
// 通常在开发环境中会设置NODE_ENV为development，在生产环境中设置为production。
export function getRunMode() {
    if (process.env.NODE_ENV === 'development') {
        return 'DEBUG'
    }
    return 'RELEASE'
}

// 判断当前环境是否为开发环境，开发环境通常会有一些特殊的配置和行为，比如启用热重载、使用开发数据库等。
export function isEnvDev() {
    return getEnvName() === 'development'
}

// 判断当前环境是否为测试环境，测试环境通常会有一些特殊的配置和行为，比如使用测试数据库、启用调试日志等。
export function isEnvTest() {
    return getEnvName() === 'test'
}

// 判断当前环境是否为生产环境，生产环境通常会有一些特殊的配置和行为，比如更严格的安全措施、更高的性能优化等。
export function isEnvProd() {
    return getEnvName() === 'production'
}

// 获取当前环境的名称，环境名称可以通过环境变量ENV_NAME来指定，如果没有指定则默认为production。
export function getEnvName() {
    return process.env.ENV_NAME || 'production'
}

// 返回可以暴露到浏览器端的公共配置
// export function usePublicConfig(serverConfig: IServerConfigProvider): IBrowserConfig {
//     return {
//         PUBLIC_MODE: serverConfig.RUN_MODE,
//         PUBLIC_SELF_URL: serverConfig.PUBLIC_SELF_URL,
//         PUBLIC_TURNSTILE: serverConfig.CLOUDFLARE_PUBLIC_TURNSTILE,
//         PUBLIC_PORTAL_URL: serverConfig.PUBLIC_PORTAL_URL,
//     }
// }
