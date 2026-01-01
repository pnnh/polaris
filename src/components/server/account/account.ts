'use server'

import {CodeOk, PLGetResult} from "@pnnh/atom";
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {getDefaultImageUrl} from "@/components/common/note";
import {cookies} from "next/headers";
import {AccountModel} from "@/components/common/models/account/account";

export async function serverGetUserinfo(portalUrl: string): Promise<AccountModel | undefined> {
    const url = `${portalUrl}/console/userinfo`
    const cookieStore = await cookies()
    const authHeader = cookieStore.toString()
    const getResult = await serverMakeGet(url, authHeader) as PLGetResult<AccountModel>
    if (!getResult || getResult.code !== CodeOk || !getResult.data) {
        console.warn('获取用户信息失败')
        return undefined
    }
    const userInfo = getResult.data
    if (!userInfo || !userInfo.uid) {
        console.warn('用户信息不完整')
        return undefined
    }
    if (userInfo.photo) {
        userInfo.photoUrl = userInfo.photo
    } else {
        userInfo.photoUrl = getDefaultImageUrl()
    }
    return userInfo
}
