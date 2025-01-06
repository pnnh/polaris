import {getVisitorId} from "@/services/client/comments/fingerprint";
import {PLGetResult, PLInsertResult, PLSelectResult} from "@/atom/common/models/protocol";
import {getBackendUrl, makeGet, makePost} from "@/services/client/http";
import {AccountModel} from "@/atom/common/models/account";

export async function submitSignup(submitRequest: any) {
    submitRequest.fingerprint = await getVisitorId()
    const url = getBackendUrl() + '/account/signup'
    return await makePost(url, submitRequest) as PLInsertResult<AccountModel>
}

export async function accountSignin(submitRequest: any) {
    submitRequest.fingerprint = await getVisitorId()
    const url = getBackendUrl() + '/account/signin'
    return await makePost(url, submitRequest) as PLInsertResult<AccountModel>
}

export async function accountSignout(submitRequest: any) {
    submitRequest.fingerprint = await getVisitorId()
    const url = getBackendUrl() + '/account/signout'
    return await makePost(url, submitRequest)
}

export async function getUserinfo() {
    const url = getBackendUrl() + '/account/userinfo'
    return await makeGet(url) as PLGetResult<AccountModel>
}
