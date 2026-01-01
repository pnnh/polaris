'use client'

import {getVisitorId} from "@/components/client/comments/fingerprint";
import {clientMakeGet, clientMakePost} from "@pnnh/atom/browser";
import {ATInsertResult, PLGetResult, PLInsertResult} from "@pnnh/atom";
import {IAuthApp} from "@/components/common/models/auth";
import {PNSessionViewModel} from "@/components/common/models/account/session";
import {AccountModel} from "@/components/common/models/account/account";

export async function submitSignup(portalUrl: string, submitRequest: any) {
    submitRequest.fingerprint = await getVisitorId()
    const url = `${portalUrl}/account/signup`
    return await clientMakePost(url, submitRequest) as PLInsertResult
}

export async function accountSignin(portalUrl: string, submitRequest: any) {
    submitRequest.fingerprint = await getVisitorId()
    const url = `${portalUrl}/account/signin`
    return await clientMakePost<PLInsertResult>(url, submitRequest)
}

export async function accountSignout(portalUrl: string, submitRequest: any) {
    submitRequest.fingerprint = await getVisitorId()
    const url = `${portalUrl}/account/signout`
    return await clientMakePost(url, submitRequest)
}

export async function getUserinfo(portalUrl: string) {
    const url = `${portalUrl}/account/userinfo`
    return await clientMakeGet(url) as PLGetResult<AccountModel>
}

export async function queryAuthApp(portalUrl: string, appName: string) {
    const url = `${portalUrl}/account/auth/app?app=${encodeURIComponent(appName)}`
    return await clientMakeGet(url) as PLGetResult<IAuthApp>
}

export async function permitAppLogin(portalUrl: string, submitRequest: any) {
    submitRequest.fingerprint = await getVisitorId()
    const url = `${portalUrl}/account/auth/permit`
    return await clientMakePost<ATInsertResult<PNSessionViewModel>>(url, submitRequest)
}
