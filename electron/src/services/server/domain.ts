import {IDomain, trySigninDomain} from "@/services/common/domain";
import {serverConfig} from "@/services/server/config";

export async function serverSigninDomain(): Promise<IDomain> {
    const domain = await trySigninDomain(serverConfig.WORKER_URL)
    if (!domain) {
        throw new Error('domain not found')
    }
    return domain
}
