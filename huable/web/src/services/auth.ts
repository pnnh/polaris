import 'server-only'
import {serverSigninDomain} from "@/services/server/domain/domain";
import {AccountModel} from "@/models/account";
import {SessionModel} from "@/models/session";

export async function loadSessions2() {
    const sessionList: SessionModel[] = []

    const domain = serverSigninDomain()
    const accountModel = await domain.makeGet<AccountModel>('/account/information')
    if (accountModel && accountModel.urn) {
        sessionList.push({
            account: accountModel,
            name: accountModel.urn,
            token: '',
            domain: '',
        })
    }
    return sessionList
}