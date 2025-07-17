'use server'

import {AccountModel} from "@/atom/common/models/account";
import {CodeOk, PLGetResult, PLInsertResult} from "@/atom/common/models/protocol";
import {serverMakeGet} from "@/atom/server/http";
import {getDefaultImageUrl} from "@/services/common/note";
import {cookies} from "next/headers";

export async function serverGetUserinfo(portalUrl: string): Promise<AccountModel | undefined> {
    const url = `${portalUrl}/account/userinfo`
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
        userInfo.photoUrl = userInfo.photo.startsWith('http://') || userInfo.photo.startsWith("https://") ?
            userInfo.photo : `${portalUrl}/storage${userInfo.photo}`
    } else {
        userInfo.photoUrl = getDefaultImageUrl()
    }
    return userInfo
}
