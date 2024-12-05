import {IDomain, trySigninDomain} from "@/services/common/domain";

export async function clientSigninDomain(): Promise<IDomain> {
    const appConfig = await window.serverAPI.getAppConfig()
    const domain = await trySigninDomain(appConfig.WORKER_URL)
    if (!domain) {
        throw new Error('domain not found')
    }
    return domain
}
